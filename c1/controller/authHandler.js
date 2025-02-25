const User = require(`../model/user/userSchema`);
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);

exports.signup = async ( req,res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const token = jwt.sign({id: newUser._id,
            name: newUser.name, email: newUser.email,
        role: newUser.roles}, process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES,
    });

    res.cookie(`jwt`, token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 10000),
        secure: false,
        httpOnly: true,
    });

    res.status(201).json({
        status: `Success`,
        token,
        data: {
            user: newUser
        }
    });
    } catch (err){
        res.status(500).json({
            status: `fail`,
            err: err.message
        });
    }
};

exports.login = async ( req, res ) =>{
    try{
        // const email = req.body.email;
        // const password = req.body.password;
        const { email, password} = req.body;

        if ( !email || !password ){
            return res.status(400).send(`Please provide email or password!`);
        }

        //2 proveruvame dali korisnikot postoi
        const user = await User.findOne({email})
        if (!user){
            return res.status(401).send(`Invalid email or password`);
        }


        //3 Sporeduvame passwords

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid){
            return res.status(401).send(`Invalid email or password`);
        }

        //4 Se generira i isprakja token

        const token = jwt.sign({id: newUser._id,
        name: newUser.name, email: newUser.email,
        role: newUser.roles}, process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXPIRES,
    });

    //5 Se generira i isprakja cookie

    res.cookie(`jwt`, token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 10000),
        secure: false,
        httpOnly: true,
    });

    //6 Se isprakja tokenot

    res.status(201).json({
        status: `Success`,
        token,
    });

    }catch (err){
        res.status(500).son({
            status: `fail`,
            err: err.message,
        });
    }
}
