const Movie = require(`../model/moviesModel`);

exports.getLoginForm = async (req, res) => {
    try {
      res.status(200).render('login', {
        title: 'Login',
        podnaslov: 'Login to see our movies',
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
  exports.movieView = async (req, res) => {
    try {
      const movies = await Movie.find();
      res.status(200).render('viewFilms', {
        naslov: 'Movies site',
        kategorija: 'All movies',
        movies,
      });
    } catch (err) {
      res.status(500).send('Error');
    }
  };
  
  exports.createMovie = async (req, res) => {
    try {
      console.log(req.body);
      await Movie.create(req.body);
      res.redirect('/viewmovies');
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
  exports.deleteMovie = async (req, res) => {
    try {
      const movieId = req.params.id;
      await Movie.findByIdAndDelete(movieId);
      res.redirect('/viewmovies');
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  exports.viewMovieById = async (req,res) => {
    try{
      const movie = await Movie.findById(req.params.id);
      res.status(200).render(`viewMovie`,{
        movie
      })
    } catch(err) {
      res.status(500).send(err.message);
    }
  };