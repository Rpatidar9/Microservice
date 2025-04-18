const joi = require('joi');

const registerValidate = (data) => {
    const schema = joi.object({
        username: joi.string().min(6).required(),
        email: joi.string().email().min(6).required(),
        password: joi.string().min(6).required(),
    });

    return schema.validate(data);
};

module.exports = registerValidate;  // ✅ Fixed `model.exports` to `module.exports`
