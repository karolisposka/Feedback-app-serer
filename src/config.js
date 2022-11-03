require('dotenv').config();

module.exports={
    jwtSecret: process.env.JWT_SECRET,
    bucketName: process.env.AWS_BUCKET_NAME,
    S3Config:{
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET
        },
        region: process.env.AWS_BUCKET_REGION,
    },
    mysqlConfig:{
        user: process.env.DB_USERNAME,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: process.env.DB_PORT,
        database: process.env.DATABASE,
    }
}
