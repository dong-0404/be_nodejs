const { Op } = require('sequelize');
const RepositoryInterface = require('../interfaces/repository.interface');

class OrderRepository extends RepositoryInterface {
    constructor(db) {
        super();
        this.db = db;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.OrderAddress = db.OrderAddress;
        this.Product = db.Product;
        this.ProductVariant = db.ProductVariant;
        this.ProductImage = db.ProductImage;
        this.User = db.User;
        this.model = db.Order;
    }

    // Generate unique order number
    async generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${random}`;
    }

    // Create order with items and addresses
    async createOrder(orderData, items, addresses) {
        const transaction = await this.db.sequelize.transaction();
        try {
            // Generate order number
            const orderNumber = await this.generateOrderNumber();
            
            // Create order
            const order = await this.Order.create({
                ...orderData,
                orderNumber
            }, { transaction });

            // Create order items
            const orderItems = await Promise.all(
                items.map(item => 
                    this.OrderItem.create({
                        orderId: order.id,
                        productId: item.productId,
                        productVariantId: item.productVariantId,
                        nameSnapshot: item.nameSnapshot,
                        brandSnapshot: item.brandSnapshot,
                        imageSnapshot: item.imageSnapshot,
                        skuSnapshot: item.skuSnapshot,
                        unitPrice: item.unitPrice,
                        originalPrice: item.originalPrice,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice
                    }, { transaction })
                )
            );

            // Create order addresses
            const orderAddresses = await Promise.all(
                addresses.map(address =>
                    this.OrderAddress.create({
                        orderId: order.id,
                        type: address.type,
                        fullName: address.fullName,
                        phone: address.phone,
                        line1: address.line1,
                        line2: address.line2,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country
                    }, { transaction })
                )
            );

            await transaction.commit();
            
            // Return order with items and addresses
            return await this.findById(order.id);
        } catch (error) {
            await transaction.rollback();
            throw new Error(`Failed to create order: ${error.message}`);
        }
    }

    // Find order by ID with all related data
    async findById(id) {
        try {
            const order = await this.Order.findByPk(id, {
                include: [
                    {
                        model: this.User,
                        as: 'user',
                        attributes: ['id', 'full_name', 'email', 'phone']
                    },
                    {
                        model: this.OrderItem,
                        as: 'items',
                        include: [
                            {
                                model: this.Product,
                                as: 'product',
                                attributes: ['id', 'name', 'slug'],
                                include: [
                                    {
                                        model: this.ProductImage,
                                        as: 'images',
                                        attributes: ['id', 'imageUrl', 'isPrimary'],
                                        where: { isPrimary: true },
                                        required: false
                                    }
                                ]
                            },
                            {
                                model: this.ProductVariant,
                                as: 'productVariant',
                                attributes: ['id', 'sku', 'color', 'size'],
                                required: false
                            }
                        ]
                    },
                    {
                        model: this.OrderAddress,
                        as: 'addresses'
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });

            return order;
        } catch (error) {
            throw new Error(`Failed to find order: ${error.message}`);
        }
    }

    // Get orders by user ID
    async getUserOrders(userId, options = {}) {
        try {
            const {
                status,
                page = 1,
                limit = 20,
                orderBy = 'createdAt',
                orderDirection = 'DESC'
            } = options;

            const where = { userId };
            if (status) {
                where.status = status;
            }

            const offset = (page - 1) * limit;

            const { count, rows } = await this.Order.findAndCountAll({
                where,
                include: [
                    {
                        model: this.OrderItem,
                        as: 'items',
                        attributes: ['id', 'nameSnapshot', 'imageSnapshot', 'quantity', 'unitPrice', 'totalPrice'],
                        limit: 3 // Only show first 3 items for list view
                    },
                    {
                        model: this.OrderAddress,
                        as: 'addresses',
                        where: { type: 'shipping' },
                        required: false,
                        attributes: ['type', 'fullName', 'phone', 'city', 'state']
                    }
                ],
                order: [[orderBy, orderDirection]],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                orders: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            throw new Error(`Failed to get user orders: ${error.message}`);
        }
    }

    // Update order status
    async updateStatus(orderId, status, dateField = null) {
        try {
            const updateData = { status };
            if (dateField === 'placedAt') updateData.placedAt = new Date();
            if (dateField === 'shippedAt') updateData.shippedAt = new Date();
            if (dateField === 'deliveredAt') updateData.deliveredAt = new Date();

            await this.Order.update(updateData, {
                where: { id: orderId }
            });

            return await this.findById(orderId);
        } catch (error) {
            throw new Error(`Failed to update order status: ${error.message}`);
        }
    }

    // Count orders by user
    async countByUser(userId, where = {}) {
        return await this.Order.count({ where: { userId, ...where } });
    }

    // Sum orders by user
    async sumByUser(userId, field, where = {}) {
        const sum = await this.Order.sum(field, { where: { userId, ...where } });
        return Number(sum || 0);
    }

    // Implement interface methods
    async getAll() {
        return await this.Order.findAll({
            include: [
                {
                    model: this.User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }

    async getById(id) {
        return await this.findById(id);
    }

    async create(data) {
        return await this.Order.create(data);
    }

    async update(id, data) {
        await this.Order.update(data, { where: { id } });
        return await this.findById(id);
    }

    async delete(id) {
        const deleted = await this.Order.destroy({ where: { id } });
        return deleted > 0;
    }

    async findBy(conditions) {
        return await this.Order.findAll({ where: conditions });
    }

    async count() {
        return await this.Order.count();
    }
}

module.exports = OrderRepository;
