const express = require('express');
const mysql = require('mysql2/promise');
const checkIfLoggedIn = require('../../middleware/auth/auth');
const {mysqlConfig} = require('../../config');
const {validate} = require('../../middleware/validation/validation');
const {newSuggestionValidation} = require('../../middleware/validation/validationSchemas/suggestionsValidation');
const router = express.Router();



router.get('/get', async(req,res) => {
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM suggestions`);
        await con.end();
        if(data.length > 0){
           return res.send(data);
        } else {
            return res.status(500).send({err:'something wrong with the server. Please try again later'})
        }  
    }catch(err){
        return res.status(500).send({err:'something wrong with the server. Please try again later'})
    }
})


router.get('/get/:category', async(req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM suggestions WHERE category=${mysql.escape(req.params.category.toUpperCase())}`);
        await con.end();
        if(data){
           return res.send(data);
        } else {
            return res.status(500).send({err:'something wrong with the server. Please try again later'});
        }
    }catch(err){
        res.send({err:'something wrong with the server. Please try again later'});
    }
})

router.post('/add', validate(newSuggestionValidation), async (req,res) =>{
    try{
        const currentTime = new Date().getTime();
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO suggestions (title, created_at, category, description, status)
        VALUES(${mysql.escape(req.body.title)},${mysql.escape(currentTime)},${mysql.escape(req.body.category)},${mysql.escape(req.body.description)}, ${mysql.escape('suggestion')})`);
        await con.end();
        if(data.insertId){
            return res.send({msg:'Suggestion successfully added'});
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        res.status(500).send({err: 'something wrong with the server. Please try again later'})
    }
})

router.delete('/delete/:id', checkIfLoggedIn(), async(req,res) => {
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`DELETE FROM suggestions WHERE id=${mysql.escape(req.params.id)}`);
        if(data.affectedRows){
            return res.send({msg:'suggestion deleted'});
        }
        else {
            return res.status(500).send({err: 'something wrong with the server. Please try again later'});
        }
    }catch(err){
        console.log(err)
        return res.status(500).send({err:'something wrong with the server. Please try again later'});
    }
})

router.get('/single/:id', async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM suggestions WHERE id=${mysql.escape(req.params.id)}`);
        await con.end();
        if(data.length > 0){
            return res.send(data);
        }else {
            return res.status(500).send({err:'something wrong with the server. Please try again later'});
        }
    }catch(err){
        return res.status(500).send({err:'something wrong with the server. Please try again later'})
    }
})

router.post('/edit',  checkIfLoggedIn(), async (req,res) => {
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`UPDATE suggestions SET title=${mysql.escape(req.body.title)}, status=${mysql.escape(req.body.status)}, category=${mysql.escape(req.body.category)}, description=${mysql.escape(req.body.description)} WHERE id=${mysql.escape(req.body.id)}`);
        await con.end();
        if(data.affectedRows > 0){
            return res.send({msg:'Suggestion updated'})
        } else{ 
            return res.send({err:'something wrong with the server. Please try again later'})
        }
    }catch(err){
        return res.status(500).send({err:'something wrong with the server. Please try again later'})
    }
})

module.exports = router;