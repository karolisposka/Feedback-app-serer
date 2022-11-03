const joi = require('joi');

const upvotesValidation = joi.object({
    id: joi.number().required(),  
})

module.exports = {
    upvotesValidation
}