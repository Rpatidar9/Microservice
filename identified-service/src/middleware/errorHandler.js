const logger = require('../utills/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack); // Logging the error stack properly

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
