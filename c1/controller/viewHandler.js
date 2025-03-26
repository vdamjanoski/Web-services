const Movie = require(`../model/moviesModel`);
const sendEmail = require("./emailHandler");
const User = require(`../model/user/userSchema`);
const crypto = require(`crypto`);
const jwt = require('jsonwebtoken');

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

  exports.viewMovieByQuery = async (req,res) => {
    try{
      const title = req.query;
      const movies = await Movie.find(title).populate(`author`);
      res.status(200).render(`viewmoviess`,{ movies});
    } catch(err) {
      res.status(500).send(err.message);
    }
  }

  exports.getForgotPassword = async (req, res) => {
    try {
        res.status(200).render(`forgotPassword`, {
          title: `Forgot Password`
        })
    } catch (err) {
        res.status(500).render(`error`, {
          err: err.message
        })
    }
  }

  exports.postForgotPassword = async (req, res) => {
    try {
      const user = await User.findOne({email: req.body.email});
      if (!user){
        return res.status(400).send(`Token is invalid or expired`)
      }

      const resetToken = crypto.randomBytes(32).toString(`hex`);
      user.passwordResetToken = crypto.createHash(`sha256`).update(resetToken).digest(`hex`);
      user.passwordResetExpires = Date.now() + 30 * 60 * 60 * 1000;
      user.save({validateBeforeSave: false});

      const resetUrl = `${req.protocol}://${req.get(`host`)}/submitPassword/${resetToken}`;
      await sendEmail({
        email: user.email,
        html: `<a href="${resetUrl}">Click here to reset your password!</a>`,
        subject: `Your reset token is valid for 30 minutes`,
      })
      res.status(200).redirect(`login`);
    } catch (err) {
      res.status(500).render(`error`, {
        err: err.message
      })
    }
  }

  exports.getResetPassword = async (req, res) => {
    try {
      res.status(200).render(`submitPassword`, {
        title: `Reset Password`,
        token: req.params.token
      });
    } catch(err) {
      res.status(500).render(`error`, {
      err: err.message
    })
  }
}


exports.postResetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash(`sha256`).update(req.params.token).digest(`hex`);
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {$gt: Date.now() },
    })

    if(!user){
      return res.status(400).render(`error`, {
        title: `Error`,
      })
    }

    user.password = req.body.password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    const token = jwt.sign(
      {id: user._id, name: user.name, role: user.role, email: user.email},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES }
    );

    res.cookie(`jwt`, token, {
      expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 10000),
      secure: false,
      httpOnly: true,
    })

    res.redirect(`/viewmovies`);
  } catch(err) {
    res.status(500).render(`error`, {
    err: err.message
  })
}
}
  

  