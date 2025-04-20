require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const Redis = require('ioredis');
const helmet = require('helmet');
const logger = require('./utills/logger');
const RabbitMQ = require('./utills/rabbitmq');
mongoose.connect(process.env.MONGOOSE_URI || 'mongodb://localhost:27017/Microservice')
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('Error connecting to MongoDB:', err));

// .then(() => logger.info('Connected to MongoDB'))
// .catch((err) => logger.error('Error connecting to MongoDB:', err));
const redisClient = new Redis(process.env.REDIS_PORT,process.env.REDIS_HOST);
const PORT = process.env.PORT || 3004;
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

const { handlePostCreated ,handlePostDeleted} = require('./eventHandler/event-handler');

const startServer = async () => {
    try {
      console.log('🔌 Connecting to RabbitMQ...');
      await RabbitMQ.RabbitMQConnect(); // Connect to RabbitMQ
      console.log('✅ Connected to RabbitMQ');
  
    //   console.log('📡 Setting up consumer...');
      await RabbitMQ.consumeEvent('post.created', handlePostCreated); // Consume the event
      // await RabbitMQ.consumeEvent('post.deleted', handlePostDeleted); // Consume the event
      console.log('✅ Consumer set up');
  
      console.log('🚀 Starting Express server...');
      app.listen(PORT, () => {
        logger.info(`✅ Server is running on port ${PORT}`);
      });
    } catch (error) {
      logger.error('❌ Error starting the server:', error);
    }
  };
  
  startServer();
  
