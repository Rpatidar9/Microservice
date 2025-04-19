const mongoose = require('mongoose');
const { Schema } = mongoose;
const searchSchema = new Schema({
  post_id: {
    type: String,
    required: true,
    unique: true,
    },
    user_id: {
        type: Array,
        required: true,
        unique: true,
        },
    content: {
        type: String,
        required: true,
        }
    },
        {timestamps: true}
 );

searchSchema.index({content: 'text'});
module.exports = mongoose.model('Search', searchSchema);