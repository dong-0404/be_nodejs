/**
 * Generic Service Interface
 * Có thể dùng cho tất cả services (User, Product, Order, etc.)
 */
class ServiceInterface {
    /**
     * Lấy tất cả records
     * @returns {Promise<Array>} Danh sách records
     */
    async getAll() {
        throw new Error('getAll method must be implemented');
    }

    /**
     * Lấy record theo ID
     * @param {number|string} id - ID của record
     * @returns {Promise<Object|null>} Record object hoặc null
     */
    async getById(id) {
        throw new Error('getById method must be implemented');
    }

    /**
     * Tạo record mới
     * @param {Object} data - Record data
     * @returns {Promise<Object>} Record đã tạo
     */
    async create(data) {
        throw new Error('create method must be implemented');
    }

    /**
     * Cập nhật record
     * @param {number|string} id - ID của record
     * @param {Object} data - Record data mới
     * @returns {Promise<Object>} Record đã cập nhật
     */
    async update(id, data) {
        throw new Error('update method must be implemented');
    }

    /**
     * Xóa record theo ID
     * @param {number|string} id - ID của record
     * @returns {Promise<boolean>} true nếu xóa thành công
     */
    async delete(id) {
        throw new Error('delete method must be implemented');
    }

    /**
     * Validate data
     * @param {Object} data - Data cần validate
     * @returns {Promise<Object>} Validation result
     */
    async validate(data) {
        throw new Error('validate method must be implemented');
    }
}

module.exports = ServiceInterface;
