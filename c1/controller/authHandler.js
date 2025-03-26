const User = require('../model/user/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const crypto = require('crypto');
const sendEmail = require(`./emailHandler`);
const { clear } = require('console');

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await sendEmail({
      email: newUser.email,
      subject: `Register succesfully!`,
      messages: `Thank you ${newUser.name} for your registration!`
    })

    res.status(201).json({
      status: 'Success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Please provide email or password!');
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 10000),
      secure: false,
      httpOnly: true,
    });

    res.status(201).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if(req.headers.authorization){
      token = req.headers.authorization.split(``)[1];
    }
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token){
      return res.status(500).send(`You are not logged in! Please log in first`);
    }

    const deconded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const userTrue = await User.findById(deconded.id);
    if (!userTrue){
      return res.status(401).send(`User exist!`);
    }

    req.auth = userTrue;

    next();
    
  } catch (err) {
    res.status(500).json({
      status: `fail`,
      err: err.message
    })
  }
}

// exports.signout = async (req, res) => {
//   try{
//     res.clearCookie("jwt", { 
//       httpOnly: true,
//       secure: true
//     });

//     res.redirect(`/login`);
//   }
//   catch (err) {
//     res.status(500).json({
//       status: `fail`,
//       err: err.message
//     })
// }
// }


