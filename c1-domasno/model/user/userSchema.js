const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require(`bcryptjs`);


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Korisnikot mora da ima ime!"]
    },
    email: {
        type: String,
        require: [true, "Korisnikot mora da ima validen email!"],
        lowercase: true,
        unique: true,
        validate: [validator.isEmail, "Ve molime vnesete validen email"]
    },
    roles: {
        type: String,
        enum: [`user`, `admin`],
        default: `user`,
    },
    password: {
        type: String,
        required: [true, "Korisnikot mora da ima password"],
        // minLength: [8, "Korisnickata lozinka mora da ima najmalce 8 karakteri"]
        // validate: [validator.isStrongPassword, "Korisnickata lozinka mora da ima najmalce 1 karakter 1 brojka 1 simbol"]
    },

});

userSchema.pre(`save` , async function (next) {
    if (!this.isModified(`password`)) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
