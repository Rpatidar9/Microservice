const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const postSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',    
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaURL: [{
        type: String,
        required: false 
    }
    ],
    public_id: [{
        type: String,
        required: false 
    }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
},{timestamps: true});
postSchema.index({content: 'text'});
module.exports = mongoose.model('Post', postSchema);