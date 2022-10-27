const express = require('express');
const mysql = require('mysql2/promise');
const {mysqlConfig, jwtSecret} = require('../../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const  { loginValidation, registerValidation } = require('../../middleware/validation/validationSchemas/usersValidation');
const {validate} = require('../../middleware/validation/validation');
const router = express.Router();

router.post('/register', validate(registerValidation), async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        if(hashedPassword){
            const [data] = await con.execute(`INSERT INTO users (name, username, password)
            VALUES(${mysql.escape(req.body.name)}, ${mysql.escape(req.body.username)}, ${mysql.escape(hashedPassword)})`);
            await con.end();
            if(data.insertId){
                return res.send({msg:'Registration completed'});
            } else {
                return res.status(500).send({err:'Something wrong with the server. Please try again later'});
            }
        }else{
            res.status(500).send({err:'something wrong with the server. Please try again later'})
        }
    }catch(err){
        console.log(err);
        res.status(500).send({err: err})
    }
});

router.post('/login', validate(loginValidation), async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT password, id FROM users WHERE username=${mysql.escape(req.body.username)}`);
        await con.end();
        const checkPassword = await bcrypt.compareSync(req.body.password, data[0].password);
        console.log(checkPassword);
        if(checkPassword){
            const token = await jwt.sign(data[0].id, jwtSecret);
            if(token){
                res.send({token})
            }else{
                res.status(500).send({err:"something wrong with the server.Please try again later"})
            }
        }else{
            res.send({err:"wrong password"})
        }

        
    }catch(err){
        console.log(err);
        res.status(500).send({err: err})
    }
});




module.exports = router;