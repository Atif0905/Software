const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const LogoSchema = new Schema({
    files: [String],
}, {
timestamps: true,
});

const Logomodel = model('Logo', LogoSchema);

module.exports = Logomodel;