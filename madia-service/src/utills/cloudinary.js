const Cloudinary = require('cloudinary');
const logger = require('../utills/logger');
const { v2: cloudinary } = Cloudinary;
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
cloudinary.config({cloud_name: CLOUDINARY_CLOUD_NAME||'drrfx5vki', api_key: CLOUDINARY_API_KEY || '945373698964274', api_secret: CLOUDINARY_API_SECRET || 'RtUC7-8VmIBKKYuF73enWXmp-Vs'});
const uploadMediaToCloudinary = async (filePath) => {
    return new Promise((resolve,reject)=>{
        const uploadStream = cloudinary.uploader.upload_stream({resource_type:"auto"},(error, result) => {if(error) {
            logger.error("Error uploading to Cloudinary", error);
            return reject(error);
        }else {
            logger.info("File uploaded to Cloudinary", result);
            resolve(result);
        }
   
    })
    uploadStream.end(filePath.buffer);
    
})
}
const DeleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
        logger.info("File deleted from Cloudinary", publicId);
    } catch (error) {
        logger.error("Error deleting from Cloudinary", error);
        throw error;
    }
}
module.exports = { uploadMediaToCloudinary,DeleteMediaFromCloudinary };