const User = require('../model/user/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

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

exports.forgotPassword = async (req, res) => {
  try {
    //! 1) go barame korisnikot
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send('This user doesnt exist');
    }

    //! 2) Generirame resitiracki token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    //! 3) go azurirame korisnikot
    await user.save({ validateBeforeSave: false });

    //! 4) kreiranje na resetiracki Url
    const resetUrl = `${req.protocol}://${req.get('host')}/resetPassword/${resetToken}`;

    const message = `Ja zaboravivte lozinkata, ve molime iskoristete Patch request so vashata nova lozinka - ova e reset url ${resetUrl}`;

    //! 5) Isprakjanje na mail so resetirackiot url
    await sendEmail({
      email: user.email,
      subject: 'Vashiot resetiracki token (30 minuti validen)',
      messages: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'url token send to email',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    // const token = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //! 1) Go barame korisnikot
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    //! 2) proveruvame vo slucaj da ne go pronajde korisnikot
    if (!user) {
      return res.status(400).send('Token is invalid or expired');
    }

    user.password = req.body.password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;

    await user.save();

    //! 3) kreiranje na token
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

    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(500).send('You are not logged in! please log in');
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const userTrue = await User.findById(decoded.id);
    if (!userTrue) {
      return res.status(401).send('User doesnt longer exist!');
    }

    req.auth = userTrue;

    next();
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err: err.message,
    });
  }
};