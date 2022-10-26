const express = require('express');
const mysql = require('mysql2/promise');
const {mysqlConfig} = require('../../config');
const {validate} = require('../../middleware/validation/validation');
const {commentValidation} = require('../../middleware/validation/validationSchemas/commentValidation');
const router = express.Router();



router.get('/get', async(req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM comments`);
        await con.end();
        if(data.length > 0){
           return res.send({data: data});
        } else {
            return res.status(500).send({err:'something wrong with the server. Please try again later'});
        }
    }catch(err){
        res.send({err:err});
    }
})

router.post('/add', validate(commentValidation), async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO comments (user_id, content, suggestion_id)
        VALUES(${mysql.escape(req.body.user_id)},${mysql.escape(req.body.content)}, ${mysql.escape(req.body.suggestion_id)})`);
        await con.end();
        if(data.insertId){
            return res.send({msg:'Comment posted'});
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        console.log(err);
        res.status(500).send({err: err})
    }
})

module.exports = router;