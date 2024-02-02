const mongoose = require('mongoose');

// Define the schema for the Project model


const unitSchema = new mongoose.Schema({
  name: String,
  status: { type: String, default: "available" },
  // Define other unit properties as needed
});

const blockSchema = new mongoose.Schema({
  name: String,
  units: [unitSchema], // Array of units within the block
});

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  blocks: [blockSchema], // Array of blocks within the project
});


// Create the Project model using the schema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
