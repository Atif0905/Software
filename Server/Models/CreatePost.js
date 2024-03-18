const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema({
   projectname:String,
   address:String,
   content:String,
   files:[{type: String,}],
   category:String,
   subcategory:String,
   price:String,
   type:String,
}, {
timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;