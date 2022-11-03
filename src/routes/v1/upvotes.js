const express = require('express');
const mysql = require('mysql2/promise');
const {mysqlConfig} = require('../../config');
const {validate} = require('../../middleware/validation/validation');
const { upvotesValidation } = require('../../middleware/validation/validationSchemas/upvotesValidation');
const router = express.Router();

router.post('/add', validate(upvotesValidation), async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO upvotes (suggestion_id)
        VALUES(${mysql.escape(req.body.id)})`);
        await con.end();
        if(data.insertId){
            return res.send({suggestion_id: req.body.id, id: data.insertId});
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        return res.status(500).send({err: 'something wrong with the server. Please try again later'})
    }
});

router.get('/get', async (req,res) => {
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM upvotes`);
        await con.end();
        if(data.length > 0){
            return res.send(data)
        }else {
            return res.send({err:'Oops. Something wrong with the server.Please try again later'})
        }
    }catch(err){
        return res.status(500).send({err:'Oops. Something wrong with the server. Please try again later'})
    }
})



module.exports = router;