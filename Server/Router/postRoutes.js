const express = require('express');
const router = express.Router();
const Post = require('../Models/CreatePost'); // Ensure this path points to your Post model
const upload = require('../middleware/upload'); // Ensure this path points to your upload middleware

// Create a new post with files
router.post('/createpost', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files.map(file => file.path);
    const { projectname, address, content, category, subcategory, price, type } = req.body;
    const postDoc = await Post.create({
      projectname,
      address,
      content,
      category,
      subcategory,
      price,
      type,
      files: files,
    });
    res.status(201).json(postDoc);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all posts
router.get('/createpost', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a post
router.put('/editpost/:postId', upload.single('cover'), async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, summary, content, category } = req.body;
    const cover = req.file ? req.file.path : undefined;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { title, summary, content, category, cover },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error editing post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a post
router.delete('/deletepost/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
