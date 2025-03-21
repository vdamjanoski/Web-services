const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');
const express = require('express');
const movies = require('./controller/movies');
const auth = require('./controller/authHandler');
const viewHandler = require(`./controller/viewHandler`);
const db = require('./database/database');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.static(`public`));

db.connectToDataBase();

app.post('/api/v1/signup', auth.signup);
app.post('/api/v1/login', auth.login);

app.get('/movies', movies.getAll);



app.get(`/login`, viewHandler.getLoginForm);
app.post(`/createmovie`, viewHandler.createMovie);
app.get(`/viewmovies`, viewHandler.movieView);
app.get(`/deletemovie/:id`, viewHandler.deleteMovie);
app.patch('/movies/:id', viewHandler.uploadFilmPhotos, viewHandler.updateMovie);

app.use(
  jwt
    .expressjwt({
      algorithms: ['HS256'],
      secret: process.env.JWT_SECRET,
      getToken: (req) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
        }
        if (req.cookies.jwt) {
          return req.cookies.jwt;
        }
        return null;
      },
    })
    .unless({
      path: ['/login'],
    })
);

app.get('/movies', movies.getAll);
app.get('/movies/:id', movies.getOne);
app.post('/movies', auth.protect, movies.create);
app.patch('/movies/:id', movies.uploadFilmPhotos ,movies.update);
app.delete('/movies/:id', movies.delete);
app.post('/movieByMe', auth.protect, movies.createByUser);
app.get('/movieByMe', auth.protect, movies.getByUser);

app.get('/login', viewHandler.getLoginForm);
app.get('/viewmovies', viewHandler.movieView);
app.post('/createmovie', viewHandler.createMovie);
app.get('/deletemovie/:id', viewHandler.deleteMovie);
app.get(`/viewmovie/:id`, viewHandler.viewMovieById);
app.get(`/viewmoviess`, viewHandler.viewMovieByQuery);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Could not start service');
  }
  console.log(`Service started successfully on port ${process.env.PORT}`);
});


//Click na movie da se pojavi site informacii za filmot
//Kopce za nazad
//Da se menuva filmot preku forma na click


// za forumot, sekoj korisnik da ima default slika
// na patch metoda da mozhe korisnikot da ja promeni profilnata slika