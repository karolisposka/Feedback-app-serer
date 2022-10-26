const joi = require('joi');

const newSuggestionValidation = joi.object({
    title: joi.string().required(),
    category: joi.string().required(),
    status: joi.string().required(),
    description: joi.string().required(),


})

module.exports ={
    newSuggestionValidation
}