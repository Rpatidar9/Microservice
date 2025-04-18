const mongoose = require('mongoose');
const argon2 = require('argon2');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    }
   
},{

        timestamps: true,
    
});
userSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        try {
            this.password = await argon2.hash(this.password);
        } catch (error) {
            return next(error);
        }
    }
})
userSchema.methods.comparePassword = async function(candidatePassword){
    try {
        await argon2.verify(this.password, candidatePassword);
        return true;
    } catch (error) {
        return next(error);
        
    }
}
userSchema.index({username: "text", email: "text"});
const User = mongoose.model('User', userSchema);
module.exports = User;
