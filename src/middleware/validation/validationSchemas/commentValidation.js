const joi = require('joi');

const commentValidation = joi.object({
    content: joi.string().min(1).max(250).required(),
    suggestion_id: joi.number().required(),
})

module.exports = {
    commentValidation
}