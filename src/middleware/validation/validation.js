const validate = (schema) => async (req, res, next) => {
    try{
        req.body === await schema.validateAsync(req.body);
        return next()
    }catch(err){
        console.log(err);
        res.status(500).send({err:'wrong data passed'})
    }
}

module.exports = {
    validate
}