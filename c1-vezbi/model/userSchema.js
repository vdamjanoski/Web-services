const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'You must enter your name!'],
  },
  email: {
    type: String,
    required: [true, 'You must enter your email!'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Your email is not valid'],
  },
  password: {
    type: String,
    required: [true, 'You must enter your password!'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;