const joi = require('joi');

const repliesValidation = joi.object({
    content: joi.string().min(1).max(250).required(),
    user_id: joi.number().required(),
    comment_id: joi.number().required(),
})

module.exports ={
    repliesValidation
}