const logger = require('../utills/logger');
const registerValidate = require('../utills/validate');   
const User = require('../model/user.model'); 
const generateToken = require('../utills/generateToken');
module.exports = {
 userRegister : async(req,res)=>{
    try {
        const {error} = registerValidate(req.body);
        if(error) {
            logger.warn("validation error",error.details[0].message);
            return res.status(400).json({message:error.details[0].message})};
        const {username,email,password} = req.body;
        const emailExist = await User.findOne({email});
        if(emailExist) {
            logger.warn("Email already exists");
            return res.status(400).json({message:"Email already exists"})};
        const user = new User({
            username,email,password
        });
        await user.save();
        logger.info("User registered successfully");
const{token,RefreshToken} = await generateToken(user);  

        return res.status(200).json({status:204,message:"User registered successfully",token,RefreshToken});
    } catch (error) {
        logger.error("Error in user registration",error.message);
        return res.status(500).json({status:500,message:"Internal Server Error"});
    }
}
}