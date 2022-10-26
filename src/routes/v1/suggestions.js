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
        const [upvotes] = await con.execute(`SELECT * FROM upvotes`);
        await con.end();
        if(data.length > 0 && upvotes.length > 0){
            const mappedData = data.map(item => {
                return {
                    ...item,
                    upvotes: upvotes.filter(upvote => upvote.suggestion_id === item.id).length
                }
            })
           return res.send({data: mappedData});
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
        const [data] = await con.execute(`INSERT INTO suggestions (title, created_at, category, description)
        VALUES(${mysql.escape(req.body.title)},${mysql.escape(currentTime)},${mysql.escape(req.body.category)},${mysql.escape(req.body.description)})`);
        await con.end();
        if(data.insertId){
            return res.send({msg:'Suggestion successfully added'});
        } else {
            return res.status(500).send({err:'Something wrong with the server. Please try again later'});
        }
    }catch(err){
        console.log(err);
        res.status(500).send({err: err})
    }
})

router.get('/single/:id', async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM suggestions WHERE id=${mysql.escape(req.params.id)}`);
        const [upvotes] = await con.execute(`SELECT * FROM upvotes WHERE suggestion_id=${mysql.escape(req.params.id)}`);
        const [comments] = await con.execute(`SELECT * FROM comments WHERE suggestion_id=${mysql.escape(req.params.id)}`);
        const [users] = await con.execute(`SELECT username, name, id FROM users`);
        if(data.length > 0 && upvotes && comments ){
            const mappedData = data.map(item=> {
                return {
                    ...item,
                    upvotes: upvotes.filter(upvote => upvote.suggestion_id === item.id).length,
                    comments: comments.filter(comment => comment.suggestion_id === item.id).map(com => {
                        return {
                            ...com,
                            test: com.user_id,
                            user: users.filter(user => user.id === com.user_id),
                        }
                    })
                };
            })
            res.send({data: mappedData});
        }
    }catch(err){
        console.log(err);
    }
})












module.exports = router;