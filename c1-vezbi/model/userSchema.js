const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, `You must enter your name!`]
    },
    surname: {
        type: String,
        require: [true, `You must enter your surname!`]
    },
    email: {
        type: String,
        require: [true, `You must enter your email!`],
        validate: [validator.isEmail, `Please enter valid email`],
        unique: [true, `There is another user using this email!`],
        lowercase: true,
    },
    password: {
        type: String,
        require: [true, `You must enter your password!`]
    }
});

userSchema.pre(`save` , async function (next) {
    if (!this.isModified(`password`)) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;