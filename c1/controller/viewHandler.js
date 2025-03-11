const Movie = require(`../model/moviesModel`);

const multer = require(`multer`);
const uuid = require(`uuid`);

const imageId = uuid.v4();

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, `public/img`);
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split(`/`)[1];
    callback(null, `movie-${imageId}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith(`image`)){
    callback(null, true);
  } else {
    callback(new Error(`FIle type is not supported`), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// exports.uploadFilmsPhotos = upload.fields([
//   { name: `slika`, maxCount: 1},
//   { name: `sliki`, maxCount: 3},
// ]);



exports.uploadFilmPhotos = upload.single(`slika`);

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

  exports.updateMovie = async (req,res) => {
    try {
      if(req.file){
        const fileName = req.file.filename;
        req.body.slika = fileName;
      }
      const movieById = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      res.status(200).json(movieById);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

