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
  totalLand: String, 
  GST: String,
  Bsprate: String,
  AccountNo: String,
  Bank: String,
  IFSC: String,
  Payable: String,
  CompanyName: String,
  Posessionfinaldate: String,
  ProjectID: { type: String, unique: true },  // Unique ProjectID
  blocks: [blockSchema]
});

// Pre-save hook to auto-generate the ProjectID
projectSchema.pre('save', async function (next) {
  const project = this;

  // Only generate ProjectID if it's a new document and ProjectID is not already set
  if (!project.isNew || project.ProjectID) {
    return next();
  }

  try {
    // Count existing projects to determine the next ProjectID
    const count = await mongoose.model('Project').countDocuments({});
    const newProjectID = `PI${String(count + 1).padStart(2, '0')}`;  // Format as PI01, PI02, etc.
    
    project.ProjectID = newProjectID;
    next();
  } catch (error) {
    next(error);
  }
});

// Create the Project model using the schema
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
