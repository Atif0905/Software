const mongoose = require('mongoose');

// Define the schema for the Unit model
const unitSchema = new mongoose.Schema({
  name: String,
  status: { type: String, default: "available" },
  plotSize: String,
  sizeType: String,
  rate: String,
  idcCharges: String,
  plcCharges: String,
  totalPrice: String,
  edcPrice: String,
});

// Define the schema for the Block model
const blockSchema = new mongoose.Schema({
  name: String,
  totalPlotInBlock: Number,
  plotSize: String,
  basicRateOfBlock: String,
  idcRateOfBlock: String,
  edcRateOfBlock: String,
  units: [unitSchema] // Array of units within the block
});

// Define the schema for the Project model
const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  totalLand: String, // New field for total land
  blocks: [blockSchema] // Array of blocks within the project
});

// Create the Project model using the schema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;