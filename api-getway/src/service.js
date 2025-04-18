const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const proxy = require('express-http-proxy');
const ratelimit = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(ratelimit);
const proxyOptions = {
    proxyReqPathResolver: function(req) {
        return req.originalUrl.replace(/^\/v1/,'/api');
    },
    proxyErrorHandler: function(err, res, next) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again later.');
    }
};
//setting up proxy for our identify service
app.use('/v1/auth',proxy(process.env.IDENTIFY_SERVICE_URL||"http://localhost:3001",proxyOptions,{
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Content-type'] = "application/json";
        return proxyReqOpts;
    }},{
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        console.log(`response from identify service ${proxyRes.statusCode}`);
        
        return proxyResData;
    }
}
));
//setting up proxy for our post service
app.use('/v1/post',proxy(process.env.IDENTIFY_SERVICE_URL||"http://localhost:3002",proxyOptions,
{
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Content-type'] = "application/json";
        return proxyReqOpts;
    }},
    {
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
        console.log(`response from identify service ${proxyRes.statusCode}`);
        
        return proxyResData;
    },
},
));

app.use('/v1/media', proxy(
  process.env.MEDIA_SERVICE_URL || "http://localhost:3003",
  {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
      if (!srcReq.headers['content-type']?.startsWith('multipart/form-data')) {
        proxyReqOpts.headers['Content-type'] = "application/json";
      }
      return proxyReqOpts;
    },
    userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
      console.log(`Response from media service: ${proxyRes.statusCode}`);
      return proxyResData;
    },
    parseReqBody: false
  }
));

app.use((req,res,next)=>{
    console.log(`${req.method} ${req.url}`);
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    next();
})

app.listen(PORT,()=>{
    console.log(`API get way is running on port ${PORT}`);
    console.log(`Idefied service is running on port  ${process.env.IDENTITY_SERVICE_URL}`);
    console.log(`Idefied service is running on port  ${process.env.POST_SERVICE_URL}`);
    console.log(`media service is running on port  ${process.env.MEDIA_SERVICE_URL}`);
    console.log(`Redis is running on port ${"redis://localhost:6379"}`);
});
