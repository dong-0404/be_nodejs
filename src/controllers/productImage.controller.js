const BaseController = require('./base.controller');
const multer = require('multer');
const fileService = require('../services/FileService');
const { body, param } = require('express-validator');
const container = require('../di-container/di-container');

class ProductImageController extends BaseController {
    constructor() {
        super();
        this.productService = container.resolve('productService');
    }

    // Configure multer for product images
    static configureMulter() {
        return multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB limit for product images
                files: 10 // Maximum 10 files at once
            },
            fileFilter: (req, file, cb) => {
                // Check file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
                }
            }
        });
    }

    // Validation rules
    static uploadValidationRules() {
        return [
            param('productId').isInt().withMessage('Product ID must be an integer'),
            body('altText').optional().isString(),
            body('sortOrder').optional().isInt({ min: 0 }),
            body('isPrimary').optional().isBoolean()
        ];
    }

    static updateValidationRules() {
        return [
            param('productId').isInt().withMessage('Product ID must be an integer'),
            param('imageId').isInt().withMessage('Image ID must be an integer'),
            body('altText').optional().isString(),
            body('sortOrder').optional().isInt({ min: 0 }),
            body('isPrimary').optional().isBoolean()
        ];
    }

    // Upload product images
    async uploadImages(req, res) {
        try {
            const { productId } = req.params;
            const { altText, sortOrder, isPrimary } = req.body;

            // Check if product exists
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return this.error(res, 'Product not found', 'Product not found', 404);
            }

            // Handle multiple files
            const files = req.files || [req.file].filter(Boolean);
            if (!files || files.length === 0) {
                return this.error(res, 'No files uploaded', 'Bad request', 400);
            }

            const uploadedImages = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Upload file to storage
                const uploadResult = await fileService.uploadFile(file, 'products');
                
                // Create product image record
                const imageData = {
                    productId: parseInt(productId),
                    imageUrl: uploadResult.url,
                    altText: altText || `${product.name} - Image ${i + 1}`,
                    sortOrder: sortOrder || i,
                    isPrimary: isPrimary === 'true' || (i === 0 && files.length === 1)
                };

                const image = await product.createProductImage(imageData);
                uploadedImages.push(image);
            }

            return this.success(res, uploadedImages, 'Images uploaded successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to upload images', 500);
        }
    }

    // Get product images
    async getProductImages(req, res) {
        try {
            const { productId } = req.params;

            // Check if product exists
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return this.error(res, 'Product not found', 'Product not found', 404);
            }

            const images = await product.getImages({
                order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
            });

            return this.success(res, images, 'Product images retrieved successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to get product images', 500);
        }
    }

    // Update product image
    async updateImage(req, res) {
        try {
            const { productId, imageId } = req.params;
            const { altText, sortOrder, isPrimary } = req.body;

            // Check if product exists
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return this.error(res, 'Product not found', 'Product not found', 404);
            }

            // Find the specific image
            const image = await product.getImages({
                where: { id: imageId }
            });

            if (!image || image.length === 0) {
                return this.error(res, 'Image not found', 'Image not found', 404);
            }

            const imageToUpdate = image[0];

            // If setting as primary, unset other primary images
            if (isPrimary === true) {
                await product.getImages().then(images => {
                    return Promise.all(images.map(img => {
                        if (img.id !== parseInt(imageId)) {
                            return img.update({ isPrimary: false });
                        }
                    }));
                });
            }

            // Update image
            const updateData = {};
            if (altText !== undefined) updateData.altText = altText;
            if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
            if (isPrimary !== undefined) updateData.isPrimary = isPrimary;

            await imageToUpdate.update(updateData);

            return this.success(res, imageToUpdate, 'Image updated successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to update image', 500);
        }
    }

    // Delete product image
    async deleteImage(req, res) {
        try {
            const { productId, imageId } = req.params;

            // Check if product exists
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return this.error(res, 'Product not found', 'Product not found', 404);
            }

            // Find the specific image
            const image = await product.getImages({
                where: { id: imageId }
            });

            if (!image || image.length === 0) {
                return this.error(res, 'Image not found', 'Image not found', 404);
            }

            const imageToDelete = image[0];

            // Delete from Cloudinary storage
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = imageToDelete.imageUrl.split('/');
                const publicId = urlParts[urlParts.length - 1].split('.')[0];
                const folder = urlParts[urlParts.length - 2];
                const fullPublicId = `ecommerce/${folder}/${publicId}`;
                
                await fileService.deleteFile(fullPublicId);
                console.log(`✅ Deleted image from Cloudinary: ${fullPublicId}`);
            } catch (deleteError) {
                console.error('Failed to delete from Cloudinary:', deleteError.message);
                // Continue with database deletion even if Cloudinary deletion fails
            }

            // Delete from database
            await imageToDelete.destroy();

            return this.success(res, {}, 'Image deleted successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to delete image', 500);
        }
    }

    // Set primary image
    async setPrimaryImage(req, res) {
        try {
            const { productId, imageId } = req.params;

            // Check if product exists
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return this.error(res, 'Product not found', 'Product not found', 404);
            }

            // Find the specific image
            const image = await product.getImages({
                where: { id: imageId }
            });

            if (!image || image.length === 0) {
                return this.error(res, 'Image not found', 'Image not found', 404);
            }

            const imageToSet = image[0];

            // Unset all other primary images
            await product.getImages().then(images => {
                return Promise.all(images.map(img => {
                    if (img.id !== parseInt(imageId)) {
                        return img.update({ isPrimary: false });
                    }
                }));
            });

            // Set this image as primary
            await imageToSet.update({ isPrimary: true });

            return this.success(res, imageToSet, 'Primary image set successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to set primary image', 500);
        }
    }

    // Reorder images
    async reorderImages(req, res) {
        try {
            const { productId } = req.params;
            const { imageIds } = req.body; // Array of image IDs in new order

            if (!Array.isArray(imageIds)) {
                return this.error(res, 'imageIds must be an array', 'Bad request', 400);
            }

            // Check if product exists
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return this.error(res, 'Product not found', 'Product not found', 404);
            }

            // Update sort order for each image
            const updatePromises = imageIds.map((imageId, index) => {
                return product.getImages({ where: { id: imageId } }).then(images => {
                    if (images && images.length > 0) {
                        return images[0].update({ sortOrder: index });
                    }
                });
            });

            await Promise.all(updatePromises);

            // Get updated images
            const images = await product.getImages({
                order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
            });

            return this.success(res, images, 'Images reordered successfully');
        } catch (error) {
            return this.error(res, error.message, 'Failed to reorder images', 500);
        }
    }
}

module.exports = ProductImageController;
