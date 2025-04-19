const Media = require('../models/media.model');
const { DeleteMediaFromCloudinary } = require('../utills/cloudinary');
const handlePostDelete = async (event) => {
    console.log('Post deleted:', event);
    const { postId, userId, public_id } = event;
    try {
        const findAllMedia = await Media.find({_id:{$in:public_id}});
        for(const media of findAllMedia){
    
           await DeleteMediaFromCloudinary(media.public_id);
           await Media.deleteOne({_id:media._id});
           console.log('Media deleted:', media.public_id);
           
        }
    } catch (error) {
        console.error('Error handling post delete event:', error);
        
    }
}
module.exports = {
    handlePostDelete,
}