const mongoose = require("mongoose");

const SubAdminSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true },
    password: String,
    userType: String,
    AssgProject: String, 
  },
  {
    collection: "SubAdmin", // Correct usage: specifying the collection name
  }
);

const SubAdmins = mongoose.model("SubAdmin", SubAdminSchema);
module.exports = SubAdmins;
