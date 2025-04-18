const Media = require('../models/media.model');
const { uploadMediaToCloudinary } = require('../utills/cloudinary');
const logger = require('../utills/logger');
 const uploadMedia = async (req, res) => {
    try {
    if(!req.file) {
        logger.error("No file uploaded");
        return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log("req.file",req.file);
    
    const { originalname, mimetype ,buffer} = req.file;
    const user_id = req.body.user_id; // Assuming you have user info in req.user
    const cloudinaryResponse = await uploadMediaToCloudinary(req.file);
    const createdMedia = await Media.create({
        public_id: cloudinaryResponse.public_id,
        originalName: originalname,
        url: cloudinaryResponse.secure_url,
        user_id: user_id,
        mime_type: mimetype
    });

    res.status(201).json({
        message: 'File uploaded successfully',
        data: createdMedia
    });
} catch (error) {
    logger.error("Error uploading file", error);
    res.status(500).json({        message: 'Error uploading file',
        error: error.message
    });
 }
}
const GetAllUploadMedia = async (req, res) => {
    try {
        const AllMedia = await Media.find({});
        if (!AllMedia || AllMedia.length === 0) {
            return res.status(404).json({ message: 'No media found' });
        }
        res.status(200).json({
            message: 'All media fetched successfully',
            data: AllMedia
        });
    } catch (error) {
        logger.error("Error fetching media", error);
        res.status(500).json({ message: 'Error fetching media', error: error.message }); 
        
    }
}
module.exports = { uploadMedia ,GetAllUploadMedia};