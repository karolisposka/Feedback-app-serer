const express = require('express');
const mysql = require('mysql2/promise');
const {mysqlConfig} = require('../../config');
const {validate} = require('../../middleware/validation/validation');
const {newSuggestionValidation} = require('../../middleware/validation/validationSchemas/suggestionsValidation');
const router = express.Router();



router.get('/get', async(req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM suggestions`);
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

router.post('/add', validate(newSuggestionValidation), async (req,res) =>{
    try{
        const currentTime = new Date().getTime();
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO suggestions (title, created_at, category, status, description, upvotes)
        VALUES(${mysql.escape(req.body.title)},${mysql.escape(currentTime)},${mysql.escape(req.body.category)},${mysql.escape(req.body.status)},${mysql.escape(req.body.description)},${mysql.escape(0)})`);
        await con.end();
        if(data.insertId){
            return res.send({msg:'New suggestion added'});
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        console.log(err);
        res.status(500).send({err: err})
    }
})












module.exports = router;