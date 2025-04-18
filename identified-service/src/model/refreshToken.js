const mongoose = require('mongoose');
const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    createdByIp: {
        type: String,
        required: false,
    },
    revoked: {
        type: Date,
    },
    revokedByIp: {
        type: String,
    },
    replacedByToken: {
        type: String,
    },
}, {
    timestamps: true,
})
refreshTokenSchema.index({expires: 1}, {expireAfterSeconds: 0});
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;