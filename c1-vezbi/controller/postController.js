const Post = require(`../model/post/postSchema`);

//! Zadaca za chas
//! Kreiranje na forum ---
//? get /posts za moze da gi zemame site posta
//? get /post:id specificen post
//? post /posts da moze kako korisnici da kreirame post
//? i da imame /myprofile kade sto kje gi prikazuvame samo nashite postovi

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create({title: req.body.title, content: req.body.content});

    res.status(201).json({
      status: 'Success',
      data: {
        post: newPost,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};

exports.getPosts = async (req, res) => {
    try{
        const posts = await Post.find();

        res.status(201).json({
            status: `Success`,
            data:{
                post: posts
            }
        })
    } catch (err) {
        res.status(500).json({
          status: 'fail',
          err: err.message,
        });
      }
}

exports.getPost = async (req, res) => {
    try{
        const postById = await Post.findById(req.params.id);

        res.status(201).json({
            status: `Success`,
            data:{
                postById,
            }
        })
    } catch (err) {
        res.status(500).json({
          status: 'fail',
          err: err.message,
        });
      }
}

// exports.getPostsByUser = async (req,res) => {
//     try{
//         const
//     } catch (err) {
//         res.status(500).json({
//           status: 'fail',
//           err: err.message,
//         });
//       }
// }
