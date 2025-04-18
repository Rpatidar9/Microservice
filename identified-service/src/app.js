require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const logger = require('./utills/logger');
const redis = require('ioredis');
const rateLimitRadis = require('rate-limit-redis');
const exxpressRateLimit = require('express-rate-limit');
mongoose.connect(process.env.MONGOOSE_URI||'mongodb://localhost:27017/Microservice', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('Error connecting to MongoDB:', err));
const redisClient = new redis(process.env.REDIS_PORT,process.env.REDIS_HOST);
const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    logger.info(`${req.method} ${req.url}`);
    logger.info(`Request Body: ${JSON.stringify(req.body)}`);
    next();
})
// const redisLimiter = exxpressRateLimit({
//     store: new rateLimitRadis({
//         sendCommand: (...args) => redisClient.call(...args), // Correct Redis command handling
//     }),
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per window
//     message: 'Too many requests from this IP, please try again after an hour',
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//     statusCode: 429
// });
// const sensitiveEndPointLimiter = exxpressRateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//     handler: (req, res) => { // Corrected syntax
//         logger.warn(`Too many requests from this IP: ${req.ip}`);
//         res.status(429).send('Too many requests from this IP, please try again after an hour');
//     },
//     store: new rateLimitRadis({
//         sendCommand: (...args) => redisClient.call(...args),
//     }),
// });
// app.use(redisLimiter);
const identifiedRouter = require('./routes/identified-route');
app.use('/api/auth/identified',identifiedRouter);

app.listen(PORT,()=>{
    logger.info(`Server is running on port ${PORT} 000`);
});