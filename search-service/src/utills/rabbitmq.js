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

async function consumeEvent(routingKey,callback) {
    if(!channel){
        await RabbitMQConnect();
    }
   const q =  await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
    channel.consume(q.queue, (msg) => {
        if (msg.content) {
            const message = JSON.parse(msg.content.toString());
            callback(message);
            channel.ack(msg); // Acknowledge the message after processing
            console.log('Message consumed from RabbitMQ:', message);
        }
    })
}
module.exports = {RabbitMQConnect, consumeEvent};