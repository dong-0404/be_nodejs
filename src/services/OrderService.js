const ServiceInterface = require('../interfaces/service.interface');

class OrderService extends ServiceInterface {
    constructor(orderRepository, cartRepository, productRepository, addressRepository) {
        super();
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.addressRepository = addressRepository;
    }

    // Create order from cart
    async createOrder(userId, orderData) {
        try {
            const {
                shippingAddressId,
                billingAddressId,
                paymentMethodId,
                paymentMethod,
                shippingFee = 0,
                discountAmount = 0,
                taxAmount = 0,
                notes
            } = orderData;

            // Get user's cart
            const cart = await this.cartRepository.getOrCreateCart(userId);
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error('Cart is empty');
            }

            // Get shipping and billing addresses
            const shippingAddress = await this.addressRepository.getById(shippingAddressId);
            const billingAddress = billingAddressId 
                ? await this.addressRepository.getById(billingAddressId)
                : shippingAddress;

            if (!shippingAddress || shippingAddress.userId !== userId) {
                throw new Error('Shipping address not found or unauthorized');
            }

            if (!billingAddress || billingAddress.userId !== userId) {
                throw new Error('Billing address not found or unauthorized');
            }

            // Prepare order items from cart
            const orderItems = [];
            let subtotalAmount = 0;

            for (const cartItem of cart.items) {
                // Verify product and variant still exist and are available
                // Make sure we have fresh variant info
                let variant = cartItem.productVariant;
                if (!variant || !variant.isActive || variant.stockQuantity == null) {
                    const freshVariant = await this.productRepository.getProductVariantById
                        ? await this.productRepository.getProductVariantById(cartItem.productVariantId)
                        : await this.orderRepository.db.ProductVariant.findByPk(cartItem.productVariantId, {
                            include: [
                                {
                                    model: this.orderRepository.db.Product,
                                    as: 'product',
                                    include: [
                                        {
                                            model: this.orderRepository.db.ProductImage,
                                            as: 'images',
                                            where: { isPrimary: true },
                                            required: false
                                        }
                                    ]
                                }
                            ]
                        });

                    if (!freshVariant || freshVariant.isActive === false) {
                        throw new Error(`Product variant ${cartItem.productVariantId} is no longer available`);
                    }

                    variant = freshVariant;
                }

                if (variant.stockQuantity < cartItem.quantity) {
                    throw new Error(`Insufficient stock for ${variant.sku}`);
                }

                const product = variant.product || await this.productRepository.getById(variant.productId);
                const primaryImage = product.images?.find?.(img => img.isPrimary) || product.images?.[0] || variant.product?.images?.[0];
                
                const unitPrice = parseFloat(cartItem.priceAtAdd || variant.price);
                const quantity = cartItem.quantity;
                const totalPrice = unitPrice * quantity;
                subtotalAmount += totalPrice;

                orderItems.push({
                    productId: product.id,
                    productVariantId: variant.id,
                    nameSnapshot: product.name,
                    brandSnapshot: product.brand?.name || null,
                    imageSnapshot: primaryImage?.imageUrl || null,
                    skuSnapshot: variant.sku,
                    unitPrice: unitPrice,
                    originalPrice: parseFloat(variant.originalPrice || variant.price),
                    quantity: quantity,
                    totalPrice: totalPrice
                });
            }

            // Calculate totals
            const totalAmount = subtotalAmount + shippingFee - discountAmount + taxAmount;

            // Prepare order data
            const method = (paymentMethod || '').toLowerCase();
            const isCod = method === 'cod' || method === 'cash_on_delivery';

            const orderDataToCreate = {
                userId,
                status: 'pending',
                subtotalAmount,
                shippingFee,
                discountAmount,
                taxAmount,
                totalAmount,
                paymentStatus: 'unpaid',
                paymentProvider: isCod ? 'cod' : null,
                paymentMethod: isCod ? 'cash_on_delivery' : (paymentMethod || null),
                placedAt: new Date(),
                notes
            };

            // Prepare addresses
            const orderAddresses = [
                {
                    type: 'shipping',
                    fullName: shippingAddress.fullName,
                    phone: shippingAddress.phone,
                    line1: shippingAddress.line1,
                    line2: shippingAddress.line2,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country
                },
                {
                    type: 'billing',
                    fullName: billingAddress.fullName,
                    phone: billingAddress.phone,
                    line1: billingAddress.line1,
                    line2: billingAddress.line2,
                    city: billingAddress.city,
                    state: billingAddress.state,
                    postalCode: billingAddress.postalCode,
                    country: billingAddress.country
                }
            ];

            // Create order
            const order = await this.orderRepository.createOrder(
                orderDataToCreate,
                orderItems,
                orderAddresses
            );

            // Update stock quantities and clear cart
            await this.updateProductStock(orderItems);
            await this.cartRepository.clearCart(cart.id);

            return order;
        } catch (error) {
            throw error;
        }
    }

    // Update product stock after order
    async updateProductStock(orderItems) {
        try {
            for (const item of orderItems) {
                const variant = await this.orderRepository.db.ProductVariant.findByPk(item.productVariantId);
                if (variant) {
                    variant.stockQuantity -= item.quantity;
                    await variant.save();
                }
            }
        } catch (error) {
            throw new Error(`Failed to update product stock: ${error.message}`);
        }
    }

    // Get order by ID
    async getOrderById(orderId, userId) {
        try {
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            if (order.userId !== userId) {
                throw new Error('Unauthorized');
            }
            return order;
        } catch (error) {
            throw error;
        }
    }

    // Get user orders
    async getUserOrders(userId, options = {}) {
        try {
            return await this.orderRepository.getUserOrders(userId, options);
        } catch (error) {
            throw new Error(`Failed to get user orders: ${error.message}`);
        }
    }

    // Cancel order
    async cancelOrder(orderId, userId) {
        try {
            const order = await this.orderRepository.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            if (order.userId !== userId) {
                throw new Error('Unauthorized');
            }
            if (!['pending', 'confirmed'].includes(order.status)) {
                throw new Error('Order cannot be cancelled');
            }

            // Restore stock
            if (order.items) {
                for (const item of order.items) {
                    const variant = await this.orderRepository.db.ProductVariant.findByPk(item.productVariantId);
                    if (variant) {
                        variant.stockQuantity += item.quantity;
                        await variant.save();
                    }
                }
            }

            return await this.orderRepository.updateStatus(orderId, 'cancelled');
        } catch (error) {
            throw error;
        }
    }

    // Implement interface methods
    async getAll() {
        return await this.orderRepository.getAll();
    }

    async getById(id) {
        return await this.orderRepository.getById(id);
    }

    async create(data) {
        return await this.orderRepository.create(data);
    }

    async update(id, data) {
        return await this.orderRepository.update(id, data);
    }

    async delete(id) {
        return await this.orderRepository.delete(id);
    }

    async validate(data) {
        const errors = [];
        if (!data.userId) {
            errors.push('User ID is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

module.exports = OrderService;

