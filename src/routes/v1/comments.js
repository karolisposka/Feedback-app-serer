const express = require('express');
const mysql = require('mysql2/promise');
const checkIfLoggedIn = require('../../middleware/auth/auth');
const {mysqlConfig} = require('../../config');
const {validate} = require('../../middleware/validation/validation');
const {commentValidation} = require('../../middleware/validation/validationSchemas/commentValidation');
const router = express.Router();



router.get('/get', async(req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT users.name, users.username, users.image, comments.* FROM comments LEFT JOIN users ON users.id = comments.user_id`);
        await con.end();
        if(data.length > 0){
           return res.send(data);
        } else {
            return 
        }
    }catch(err){
        return res.send({err:'something wrong with the server. Please try again later'});
    }
})

router.post('/add', validate(commentValidation), checkIfLoggedIn(), async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO comments (user_id, content, suggestion_id)
        VALUES(${mysql.escape(req.user)},${mysql.escape(req.body.content)}, ${mysql.escape(req.body.suggestion_id)})`);
        await con.end();
        if(data.insertId){
            return res.send({content:req.body.content, user_id: req.user, suggestion_id: Number(req.body.suggestion_id), id:Number(data.insertId) });
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        return res.status(500).send({err: 'something wrong with the server. Please try again later'})
    }
})

module.exports = router;