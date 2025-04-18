const rateLimit = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis');
const Redis = require('ioredis');
const redisClient = new Redis(process.env.REDIS_HOST||"redis://localhost:6379");
const ratelimit =  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => { // Corrected syntax
        // logger.warn(`Too many requests from this IP: ${req.ip}`);
        res.status(429).send('Too many requests from this IP, please try again after an hour');
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    })
});
module.exports = ratelimit;