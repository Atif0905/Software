const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../userdetails");
const router = express.Router();

const JWT_SECRET = "your-secret-key"; // Replace with your actual secret key

// Register User
router.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// User Login
router.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    return res.json({ status: "ok", data: token });
  }
  res.json({ status: "error", error: "Invalid Password" });
});

// Get User Data from Token
router.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, result) => {
      if (err) {
        return "token expired";
      }
      return result;
    });

    if (user === "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => res.send({ status: "ok", data }))
      .catch((error) => res.send({ status: "error", data: error }));
  } catch (error) {
    res.send({ status: "error" });
  }
});

// Get All Users
router.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
    res.send({ status: "error" });
  }
});

// Delete User
router.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    await User.deleteOne({ _id: userid });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
    res.send({ status: "error" });
  }
});

// Paginated Users
router.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const results = {};
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);

  if (lastIndex < allUser.length) {
    results.next = { page: page + 1 };
  }
  if (startIndex > 0) {
    results.prev = { page: page - 1 };
  }

  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});

module.exports = router;
