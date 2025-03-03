const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const express = require('express');

const user = require('./controller/userController');
const post = require(`./controller/postController`);
const db = require(`./database/database`);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

db.connectToDatabase();

app.post('/api/v1/signup', user.signup);
app.post('/api/v1/login', user.login);

app.post(`/api/v1/posts`, post.createPost);
app.get(`/api/v1/posts`, post.getPosts);
app.get(`/api/v1/post/:id`, post.getPost);

app.post(`/api/v1/postsByUser`, user.protect, post.createByUser);
app.get(`/api/v1/myProfile`, user.protect, post.getPostsByUser);



// app.use(jwt.expressjwt({
//       algorithms: ['HS256'],
//       secret: process.env.JWT_SECRET,
//       getToken: (req) => {
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//           return req.headers.authorization.split(' ')[1];
//         }
//         if (req.cookies.jwt) {
//           return req.cookies.jwt;
//         }
//         return null;
//       },
//     })
//     .unless({
//       path: ['/api/v1/signup', '/api/v1/login'],
//     })
// );
app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Could not start service');
  }
  console.log(`Service started successfully on port ${process.env.PORT}`);
});

//! Zadaca za chas
//! Kreiranje na forum ---
//? get /posts za moze da gi zemame site posta
//? get /post:id specificen post
//? post /posts da moze kako korisnici da kreirame post
//? i da imame /myprofile kade sto kje gi prikazuvame samo nashite postovi