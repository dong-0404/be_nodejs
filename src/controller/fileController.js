// controllers/fileController.js
const fileService = require('../services/FileService');

class FileController {
    async uploadFile(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No file uploaded' 
                });
            }

            const result = await fileService.uploadFile(req.file);
            
            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // async listFiles(req, res) {
    //     try {
    //         const files = await fileService.listFiles();
            
    //         res.json({
    //             success: true,
    //             data: files
    //         });
    //     } catch (error) {
    //         console.error('List files error:', error);
    //         res.status(500).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }
    // }
}

module.exports = new FileController();