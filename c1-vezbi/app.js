const express = require(`express`);
const jwt = require(`express-jwt`);
const cookieParser = require(`cookie-parser`);

const database = require(`./database/database`);
const userController = require(`./controller/userController`);

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());


database.connectToDatabase();
app.use(jwt.expressjwt({
    algorithms: [`HS256`],
    secret: process.env.JWT_SECRET,
}).unless({
    path: ["/api/v1/home"]
}));


// app.post(`/api/v1/signup`,userController.signup);
// app.post(`/api/v1/login`,userController.login);
// app.get(`/api/v1/home`,userController.home)
app.listen(process.env.PORT, (err)=>{
    if (err){
        console.log(err.message)
    }
    console.log(`Successfully started server on ${process.env.PORT}`);
});