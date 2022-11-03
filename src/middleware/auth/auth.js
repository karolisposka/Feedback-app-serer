const jwt = require('jsonwebtoken');
const { jwtSecret } = require ('../../config');

const checkIfLoggedIn = () => async (req,res,next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        req.user = jwt.verify(token, jwtSecret);
        return next();
    }catch(err){
        res.status(500).send({err:'Not authorized!'})
    }
}

module.exports = checkIfLoggedIn;