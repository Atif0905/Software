const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const BlogSchema = new Schema({
   name:String,
   description:String,
   content1:String,
   content2:String,
   content3:String,
   content4:String,
   content5:String,
   category:String,
   files:[{type: String,}],
}, {
timestamps: true,
});

const BlogModel = model('Blog', BlogSchema);

module.exports = BlogModel;