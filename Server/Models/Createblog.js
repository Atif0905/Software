const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const BlogSchema = new Schema({
   name:String,
   description:String,
   content:String,
   category:String,
   files:[{type: String,}],
}, {
timestamps: true,
});

const BlogModel = model('Blog', BlogSchema);

module.exports = BlogModel;