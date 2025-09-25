const cloudinary = require('cloudinary').v2;

class FileService {
    constructor() {
        // Cấu hình Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true
        });
        
        this.cloudinary = cloudinary;
    }

    /**
     * Upload file lên Cloudinary
     * @param {Object} file - File object từ multer
     * @param {string} folder - Folder để lưu trữ (default: 'products')
     * @param {Object} options - Tùy chọn upload
     * @returns {Promise<Object>} - Thông tin file đã upload
     */
    async uploadFile(file, folder = 'products', options = {}) {
        try {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedTypes.includes(file.mimetype)) {
                throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.');
            }

            // Validate file size (10MB max)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                throw new Error('File size too large. Maximum size is 10MB.');
            }

            // Tùy chọn upload mặc định
            const uploadOptions = {
                folder: `ecommerce/${folder}`,
                resource_type: 'auto',
                transformation: [
                    { width: 800, height: 600, crop: 'limit' },
                    { quality: 'auto' },
                    { format: 'auto' }
                ],
                ...options
            };

            // Upload lên Cloudinary
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(file.buffer);
            });

            return {
                filename: result.public_id,
                originalName: file.originalname,
                url: result.secure_url,
                size: file.size,
                mimetype: file.mimetype,
                folder: folder,
                cloudinaryId: result.public_id,
                width: result.width,
                height: result.height,
                format: result.format
            };

        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    /**
     * Upload multiple files
     * @param {Array} files - Array of file objects
     * @param {string} folder - Folder để lưu trữ
     * @param {Object} options - Tùy chọn upload
     * @returns {Promise<Array>} - Array of upload results
     */
    async uploadMultipleFiles(files, folder = 'products', options = {}) {
        try {
            const uploadPromises = files.map(file => 
                this.uploadFile(file, folder, options)
            );
            
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new Error(`Multiple upload failed: ${error.message}`);
        }
    }

    /**
     * Xóa file từ Cloudinary
     * @param {string} publicId - Public ID của file trên Cloudinary
     * @param {string} resourceType - Loại resource (image, video, raw)
     * @returns {Promise<boolean>}
     */
    async deleteFile(publicId, resourceType = 'image') {
        try {
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType
            });
            
            console.log(`✅ File deleted from Cloudinary: ${publicId}`);
            return result.result === 'ok';
        } catch (error) {
            console.error('Delete file error:', error);
            throw new Error(`Delete file failed: ${error.message}`);
        }
    }

    /**
     * Lấy URL của file
     * @param {string} publicId - Public ID của file
     * @param {Object} options - Tùy chọn transformation
     * @returns {string} - URL của file
     */
    getFileUrl(publicId, options = {}) {
        try {
            return cloudinary.url(publicId, {
                secure: true,
                ...options
            });
        } catch (error) {
            throw new Error(`Get file URL failed: ${error.message}`);
        }
    }

    /**
     * Transform image với các tùy chọn
     * @param {string} publicId - Public ID của file
     * @param {Object} transformations - Cloudinary transformations
     * @returns {string} - Transformed URL
     */
    transformImage(publicId, transformations = {}) {
        try {
            return cloudinary.url(publicId, {
                secure: true,
                transformation: transformations
            });
        } catch (error) {
            throw new Error(`Transform image failed: ${error.message}`);
        }
    }

    /**
     * Tạo thumbnail
     * @param {string} publicId - Public ID của file
     * @param {number} width - Chiều rộng
     * @param {number} height - Chiều cao
     * @returns {string} - Thumbnail URL
     */
    createThumbnail(publicId, width = 150, height = 150) {
        return this.transformImage(publicId, {
            width,
            height,
            crop: 'fill',
            gravity: 'center',
            quality: 'auto'
        });
    }

    /**
     * Tạo banner image
     * @param {string} publicId - Public ID của file
     * @param {number} width - Chiều rộng
     * @param {number} height - Chiều cao
     * @returns {string} - Banner URL
     */
    createBanner(publicId, width = 1200, height = 400) {
        return this.transformImage(publicId, {
            width,
            height,
            crop: 'fill',
            gravity: 'center',
            quality: 'auto'
        });
    }

    /**
     * Lấy thông tin file
     * @param {string} publicId - Public ID của file
     * @returns {Promise<Object>} - File info
     */
    async getFileInfo(publicId) {
        try {
            const result = await cloudinary.api.resource(publicId);
            return {
                publicId: result.public_id,
                url: result.secure_url,
                size: result.bytes,
                format: result.format,
                width: result.width,
                height: result.height,
                created: result.created_at
            };
        } catch (error) {
            throw new Error(`Get file info failed: ${error.message}`);
        }
    }

    /**
     * Liệt kê files trong folder
     * @param {string} folder - Folder path
     * @param {Object} options - Tùy chọn
     * @returns {Promise<Array>} - List of files
     */
    async listFiles(folder = 'ecommerce/products', options = {}) {
        try {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: folder,
                max_results: 500,
                ...options
            });
            
            return result.resources;
        } catch (error) {
            throw new Error(`List files failed: ${error.message}`);
        }
    }

    /**
     * Kiểm tra connection tới Cloudinary
     * @returns {Promise<boolean>}
     */
    async testConnection() {
        try {
            await cloudinary.api.ping();
            console.log('✅ Cloudinary connection successful');
            return true;
        } catch (error) {
            console.error('❌ Cloudinary connection failed:', error.message);
            return false;
        }
    }
}

module.exports = new FileService();
