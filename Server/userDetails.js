const mongoose = require("mongoose");
const UserDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    userType: String,
    UniqueID: String,
  },
  {
    collection: "UserInfo", // Specifies the collection name in the database
  }
);
const User = mongoose.model("UserInfo", UserDetailsSchema);
module.exports = User;