const express = require('express');
const mysql = require('mysql2/promise');
const {mysqlConfig} = require('../../config');
const router = express.Router();

router.post('/add', async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO upvotes (suggestion_id)
        VALUES(${mysql.escape(req.body.suggestion_id)})`);
        await con.end();
        if(data.insertId){
            return res.send({msg:'Upvoted!'});
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        console.log(err);
        res.status(500).send({err: err})
    }
});



module.exports = router;