const mongoose = require(`mongoose`);
const dotenv = require(`dotenv`);
dotenv.config({ path: `${__dirname}/../config.env` });


const DB = process.env.DATABASE.replace(`<PASSWORD>`, process.env.DATABASE_PASSWORD);
console.log(DB);

exports.connectToDataBase = async () => { 
    try{
        await mongoose.connect(DB)
        console.log(`Successfully connected the database!`);
    } catch(err) {
        console.log(err.message);
    }
}
//process.env na dve aplikacii