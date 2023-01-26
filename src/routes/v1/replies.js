const express = require('express');
const mysql = require('mysql2/promise');
const {mysqlConfig} = require('../../config');
const checkIfLoggedIn = require('../../middleware/auth/auth');
const {validate} = require('../../middleware/validation/validation');
const {repliesValidation} = require('../../middleware/validation/validationSchemas/repliesValidation');
const router = express.Router();



router.get('/get', async(req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM replies`);
        await con.end();
        if(data.length > 0){
           return res.send(data);
        } else {
            return
        }
    }catch(err){
        console.log(err);
        res.send({err:'something wrong with the server. Please try again later'});
    }
})

router.post('/add', validate(repliesValidation), checkIfLoggedIn(), async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO replies (user_id, content, comment_id)
        VALUES(${mysql.escape(req.user)},${mysql.escape(req.body.content)}, ${mysql.escape(req.body.comment_id)})`);
        await con.end();
        if(data.insertId){
            return res.send({content: req.body.content, comment_id: req.body.comment_id, user_id: req.user });
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        return res.status(500).send({err: 'something wrong with the server. Pleaes try again later'});
    }
})

module.exports = router;