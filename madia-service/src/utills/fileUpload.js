const multer = require('multer');
const logger = require('../utills/logger');
const upload = multer({
    storage:multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
}).single('file'); // Expecting a single file with the field name 'file'
module.exports = {
    uploadImage: async (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                logger.error('Error uploading file', err);
                return res.status(400).json({ error: 'File upload failed', details: err.message });
            }
            if (!req.file) {
                logger.error('No file uploaded');
                return res.status(400).json({ error: 'No file uploaded' });
            }
            next();
        });
    }
}