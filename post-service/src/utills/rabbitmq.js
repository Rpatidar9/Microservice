const amqp = require('amqplib');

let connection = null;
let channel = null;
const EXCHANGE_NAME = 'media_exchange';
async function RabbitMQConnect() {
    try {
         connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME,'topic', { durable: false });
        console.log('RabbitMQ connected successfully!');
        
        return channel;

    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
        
    }
}
async function publicEvent(routingKey,message) {
    if(!channel){
        await RabbitMQConnect();
    }
    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)));
    console.log('Message published to RabbitMQ:', message);
    
    
}
module.exports = {RabbitMQConnect, publicEvent};