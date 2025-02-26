const User = require(`../model/userSchema`);
const jwt = require(`express-jwt`);
const bcrypt = require(`bcryptjs`);

exports.signup = async (req,res) => {
    try{
        const token = jwt.sign({id: newUser._id,
        name: newUser.name, email: newUser.email},process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES,
    });

    res.cookie(`jwt`, token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        secure: false,
        httpOnly: true,
    });

    const newUser = await User.create(req.body);
    res.status(201).json({
        status: `Success`,
        data: { user: newUser }
    });

    } catch(err){
        res.status(500).json({
            status: `fail`,
            err: err.message
        });
    }
}

exports.login = async (req,res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password){
            return res.status(400).send(`Please provide email or password!`);
        }

        const user = await User.findOne({email});
        if (!user){
            return res.status(401).send(`Invalid email or password`);
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid){
            return res.status(401).send(`Invalid email or password`);
        }

        const token = jwt.sign({id: newUser._id, name: newUser.name, email: newUser.email}, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES,
        });

        res.cookie(`jwt`, token, {
            expires: newDate(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            secure: false,
            httpOnly: true,
        });

        res.status(201).json({
            status: `Success`,
            token,
        });

    } catch(err){
        res.status(500).json({
            status: `fail`,
            err: err.message,
        });
    }
};

