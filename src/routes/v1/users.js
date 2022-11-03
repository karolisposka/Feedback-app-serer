const express = require('express');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer  = require('multer');
const {mysqlConfig, jwtSecret, S3Config, bucketName} = require('../../config');
const {validate} = require('../../middleware/validation/validation');
const  { loginValidation, registerValidation } = require('../../middleware/validation/validationSchemas/usersValidation');
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {S3Client, PutObjectCommand, GetObjectCommand} = require('@aws-sdk/client-s3');
const s3 = new S3Client(S3Config);

router.post('/register', upload.single('file'), validate(registerValidation),  async (req,res) =>{
    try{
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        if(req.file){
            // resizing user image
            const buffer =  await sharp(req.file.buffer).resize({height:100, width:100, fit:'cover'}).toBuffer()
            const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');
            const imageName = randomImageName()
            const params = {
                Bucket: bucketName,
                Key: imageName,
                Body: buffer,
                ContentType: req.file.mimetype
            };
            const command = new PutObjectCommand(params);
            const imageUpload = await s3.send(command);
            if(imageUpload.ETag){
                const con = await mysql.createConnection(mysqlConfig);
                const [data] = await con.execute(`INSERT INTO users (name, username, password, image)
                VALUES(${mysql.escape(req.body.name)}, ${mysql.escape(req.body.username)}, ${mysql.escape(hashedPassword)}, ${mysql.escape(imageName)})`);
                await con.end();
                if(data.insertId){
                    return res.send({msg:'Registration completed'});
                } else {
                    return res.status(500).send({err:'Something wrong with the server. Please try again later'});
                }
            }else{ 
                return res.send({err:'something wrong with the Server.Please try again later'})
            }
        }else{
            //if user not attaches image
            const con = await mysql.createConnection(mysqlConfig);
            const [data] = await con.execute(`INSERT INTO users (name, username, password)
            VALUES(${mysql.escape(req.body.name)}, ${mysql.escape(req.body.username)}, ${mysql.escape(hashedPassword)})`);
            await con.end();
            if(data.insertId){
                return res.send({msg:'Registration completed'});
            } else {
                return res.status(500).send({err:'Something wrong with the server. Please try again later'});
            } 
        }
    }catch(err){
        if(err.errno ===1062){
            return res.status(400).send({err: 'User already exists'})
        } else {
            return res.status(500).send({err: err})
        }
    }
});

router.post('/login', validate(loginValidation), async (req,res) =>{
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT password, id FROM users WHERE username=${mysql.escape(req.body.username)}`);
        await con.end();
        const checkPassword = await bcrypt.compareSync(req.body.password, data[0].password);
        if(checkPassword){
            const token = await jwt.sign(data[0].id, jwtSecret);
            if(token){
                return res.send({token})
            }else{
                return res.status(500).send({err:"something wrong with the server.Please try again later"})
            }
        }else{
            return res.send({err:"wrong password"})
        }
    }catch(err){
        return res.status(500).send({err: 'Oops... Something wrong. Might be that user does not exist'})
    }
});

router.get('/get', async (req,res) => {
    try{
        const con = await mysql.createConnection(mysqlConfig);
        const [users] = await con.execute(`SELECT username, name, id, image FROM users`);
        await con.end();
        for(const user of users){
            if(user.image){
                const getObjectParams={
                    Bucket: bucketName,
                    Key: user.image,
                }
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
                user.image = url
            }else{
                user.image === null
            }
        }
        return res.send(users);
    }catch(err){
        return res.status(500).send({err:'something wrong with the server. Please try again later'})
    }
})




module.exports = router;