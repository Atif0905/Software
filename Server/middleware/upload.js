const multer = require('multer');
const path = require('path');

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Adjust the path if necessary
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Export the upload middleware
module.exports = upload;
