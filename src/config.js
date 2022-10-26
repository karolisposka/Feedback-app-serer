require('dotenv').config();

module.exports={
    mysqlConfig:{
        user: process.env.DB_USERNAME,
        password: process.env.PASSWORD,
        host: process.env.HOST,
        port: process.env.PORT,
        database: process.env.DATABASE,
    }
}
