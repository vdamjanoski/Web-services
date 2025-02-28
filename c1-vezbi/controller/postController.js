const Post = require(`../model/post/postSchema`);

exports.createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);

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


exports.createByUser = async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.auth.id,
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

exports.getPostsByUser = async (req, res) => {
    try{
        const myPosts = await Post.find({author: req.auth.id});
        res.status(201).json(myPosts);
    } catch (err) {
        res.status(500).json({
          status: 'fail',
          err: err.message,
        });
      }
}

