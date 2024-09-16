const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require('../Models/Createblog'); // Adjust the path to your Blog model

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Adjust the path to your uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to create a new blog
router.post('/createblog', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files.map(file => file.path);
    const { name, description, content1, content2, content3, content4, content5, category } = req.body;

    const blogDoc = await Blog.create({
      name, description, content1, content2, content3, content4, content5, category, files
    });

    res.json(blogDoc);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch all blogs
router.get('/createblog', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
