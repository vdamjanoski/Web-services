const Movie = require('../model/moviesModel');
const multer = require(`multer`);
const uuid = require(`uuid`);


const imageId = uuid.v4();
console.log(imageId);

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/img");
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

// Poedinecna slika
exports.uploadFilmPhotos = upload.single(`slika`);
// Povekje sliki
// exports.uploadFilmsSliki = upload.array(`sliki`, 3);
// // Kombinacija
// exports.uploadFilmsPhotos = upload.fields([
//   { name: `slika`, maxCount: 1},
//   { name: `sliki`, maxCount: 3},
// ]);

exports.update = async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);
    if(req.file){
      const fileName = req.file.filename;
      req.body.slika = fileName;
    }

    // if(req.files && req.files.sliki){
    //   const filenames = req.files.sliki.map((file)=> file.fileName);
    //   req.body.sliki = filenames;
    // }
    
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let movies = await Movie.find().populate('author', '-password').select('-slika');
    res.status(200).json({
      status: 'success',
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getOne = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};


exports.create = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
exports.delete = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.createByUser = async (req, res) => {
  try {
    const newMovie = await Movie.create({
      title: req.body.title,
      year: req.body.year,
      imdbRating: req.body.imdbRating,
      author: req.auth.id,
    });

    res.status(201).json(newMovie);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const mineMovies = await Movie.find({ author: req.auth.id });
    res.status(200).json(mineMovies);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};
