const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, `The post must have title!`]
  },
  content: {
    type: String,
    require: [true, `You must write a content to the post`],
    max: 300
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;