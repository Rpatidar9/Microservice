const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshTokenModel = require('../model/refreshToken'); // Ensure correct import

const generateToken = async (user) => {
    const token = jwt.sign(
        { _id: user._id, email: user.email },
        "jiroghirtgdwfiowhgfi", // ✅ Use a string directly as the secret key
        { expiresIn: '15m' }
    );
    
    const refreshTokenValue = crypto.randomBytes(64).toString('hex');

    const refreshToken = new RefreshTokenModel({
        token: refreshTokenValue,
        user: user._id,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    });

    await refreshToken.save(); // Use `.save()` instead of `create(refreshToken)`

    return { token, refreshTokens: refreshTokenValue };
};

module.exports = generateToken;
