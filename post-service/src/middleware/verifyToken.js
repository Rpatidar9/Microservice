const jwt = require('jsonwebtoken');
module.exports = {
    verifyToken: (req, res, next) => {
        const token = req.headers.authorization;

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).send({ message: 'No token provided!' });
        }
        
        req.user = token.split(' ')[1]; // Extract token after "Bearer"
        next();
        
    }
}
