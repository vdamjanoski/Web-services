const express = require(`express`);
// npm run start
const jwt = require(`express-jwt`);
const cookieParser = require(`cookie-parser`);

const database = require(`./database/database`);
const companyController = require(`./controller/companyController`);

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

database.connectToDataBase();
app.use(jwt.expressjwt({
    algorithms: [`HS256`],
    secret: process.env.JWT_SECRET,
    }).unless({
        path: ["/api/vi/signup", "/api/vi/login", "/user"]
    })
);
app.get(`/api/v1/user`, companyController.getAllUsers);

app.post(`/api/v1/user`, companyController.createUser);
app.patch(`/api/v1/user/:id`, companyController.updateUser);
app.delete(`/api/v1/user/:id`, companyController.deleteUser);


const port = 10000;
app.listen(port, () => {
    console.log(`Successfully started server on port ${port}`);
})