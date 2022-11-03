const joi = require('joi');

const registerValidation = joi.object({
    username: joi.string().min(1).required(),
    name: joi.string().required(),
    password: joi.string().min(8).required(),
    
})

const loginValidation = joi.object({
    username: joi.string().min(1).required(),
    password: joi.string().min(8).required(),
})

module.exports ={
    registerValidation,
    loginValidation
}