const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
    ime: {
        type: String,
        require: [true, `Mora da ima ime!`],
    },
    prezime: {
        type: String,
        require: [true, `Mora da ima prezime!`],
    },
    godini: {
        type: Number,
        min: 18,
        max: 90,
    },
    email: {
        type: String,
        require: [true, `Mora da vnesete email`],
    },
    gender: {
        type: String,
        require: [true, `Mora da vnesete pol`]
    }
})

const User = mongoose.model(`User`, userSchema);

module.exports = User;