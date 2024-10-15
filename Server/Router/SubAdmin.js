const express = require('express');
const router = express.Router();
const SubAdmin = require('../models/SubAdmin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST: Register a new SubAdmin
router.post('/', async (req, res) => {
  try {
    const { fname, lname, email, password, userType, AssgProject } = req.body;

    if (!fname || !lname || !email || !password || !userType || !AssgProject) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingSubAdmin = await SubAdmin.findOne({ email });
    if (existingSubAdmin) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSubAdmin = new SubAdmin({
      fname,
      lname,
      email,
      password: hashedPassword,
      userType,
      AssgProject,
    });

    await newSubAdmin.save();
    res.status(201).json({ message: 'SubAdmin created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

// POST: Login SubAdmin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and Password are required.' });
    }

    const subAdmin = await SubAdmin.findOne({ email });
    if (!subAdmin) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, subAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: subAdmin._id, email: subAdmin.email, userType: subAdmin.userType },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});

module.exports = router;
