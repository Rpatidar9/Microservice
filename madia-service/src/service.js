require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const logger = require('./utills/logger');
const redis = require('ioredis');
const RabbitMQ = require('./utills/rabbitmq');
const {handlePostDelete} = require('./eventHandler/media-event-handler');
mongoose.connect(process.env.MONGOOSE_URI||'mongodb://localhost:27017/Microservice', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => logger.info('Connected to MongoDB'))
.catch((err) => logger.error('Error connecting to MongoDB:', err));
const redisClient = new redis(process.env.REDIS_PORT,process.env.REDIS_HOST);
const PORT = process.env.PORT || 3003;
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
const mediaRouter = require('./route/media.route');
app.use('/',mediaRouter);
const startServer = async () => {
    try {
      console.log('🔌 Connecting to RabbitMQ...');
      await RabbitMQ.RabbitMQConnect(); // Connect to RabbitMQ
      console.log('✅ Connected to RabbitMQ');
  
      console.log('📡 Setting up consumer...');
      await RabbitMQ.consumeEvent('post.delete', handlePostDelete); // Consume the event
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
  
