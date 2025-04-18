const express = require('express');
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const Redis = require('ioredis');
const cors = require('cors');
const helmet = require('helmet');
const postRouter = require('./route/post');
const { RabbitMQConnect } = require('./utills/rabbitmq');
const app = express();
const PORT = process.env.PORT || 3002;
const redisClient = new Redis(process.env.REDIS_HOST || "redis://localhost:6379");

mongoose.connect(process.env.MONGOOSE_URI || 'mongodb://localhost:27017/Microservice', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const ratelimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => { // Corrected syntax
        logger.warn(`Too many requests from this IP: ${req.ip}`);
        res.status(429).send('Too many requests from this IP, please try again after an hour');
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    })
});
app.use(ratelimit);
app.use('/api/post', (req, res, next) => { req.redisClient = redisClient; next() }, postRouter);
async function startServer() {
    await RabbitMQConnect();
    console.log("RabbitMQ connected successfully!");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} `);
    });
}
startServer().catch(err => {
    console.error("Error starting server", err);
    process.exit(1);
});
