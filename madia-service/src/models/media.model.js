const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    public_id: { type: String, required: true, unique: true },  // Cloudinary public ID
    originalName: { type: String, required: true },  // Original filename
    url: { type: String, required: true },  // Cloudinary URL
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User model
    mime_type: { type: String, required: true }  // File type (image/jpeg, image/png, etc.)
}, { timestamps: true });

const Media = mongoose.model('Media', MediaSchema);

module.exports = Media;
