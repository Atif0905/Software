require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Project = require('./Models/UploadProjects');
const Customer = require('./Models/CastumerUpload')

const { PORT, MONGODB_URI, JWT_SECRET } = process.env; // Access environment variables

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine", "ejs");

mongoose.set('strictQuery', false); 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("DB Connected")
  })
  .catch((e) => console.log(e));

require("./userDetails");

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
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

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h", // Token expires in  1h
    });

    return res.json({ status: "ok", data: token });
  }
  res.json({ status: "error", error: "Invalid Password" });
});


app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results)
});

app.post("/uploadProject", async (req, res) => {
  const { name, description, totalLand } = req.body;

  try {
      // Create a new project using the Project model without blocks
      const project = await Project.create({ name, description, totalLand });
      res.status(201).json({ status: "ok", data: project });
  } catch (error) {
      console.error("Error uploading project:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getAllProjects", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json({ status: "ok", data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ status: "error", error: "Internal server error" });
  }
});


// Endpoint to fetch project by ID
app.get("/getProject/:projectId", async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch block by ID
app.get("/getBlock/:projectId/:blockId", async (req, res) => {
  const { projectId, blockId } = req.params;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const block = project.blocks.id(blockId);
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }
    res.status(200).json({ status: "ok", data: block });
  } catch (error) {
    console.error("Error fetching block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch unit by ID
app.get("/getUnit/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;
  
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    const block = project.blocks.id(blockId);
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }
    const unit = block.units.id(unitId);
    if (!unit) {
      return res.status(404).json({ error: "Unit not found" });
    }
    res.status(200).json({ status: "ok", data: unit });
  } catch (error) {
    console.error("Error fetching unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to edit project (add/update/delete blocks, add/update/delete units)
app.put("/editProject/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { name, description, blocks } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update project details
    project.name = name;
    project.description = description;

    // Update blocks
    project.blocks = blocks;

    await project.save();

    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error editing project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to add a block to a project
app.post("/addBlock/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { name, totalPlotInBlock, plotSize, basicRateOfBlock, idcRateOfBlock, edcRateOfBlock } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Create a new block and add it to the project
    const newBlock = {
      name,
      totalPlotInBlock,
      plotSize,
      basicRateOfBlock,
      idcRateOfBlock,
      edcRateOfBlock,
    };

    project.blocks.push(newBlock);

    await project.save();

    res.status(201).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error adding block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Endpoint to add a unit to a block
app.post("/addUnit/:projectId/:blockId", async (req, res) => {
  const { projectId, blockId } = req.params;
  const { name, plotSize, sizeType, rate, idcCharges, plcCharges,totalPrice } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const block = project.blocks.id(blockId);

    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    // Create a new unit and add it to the block
    const newUnit = {
      name,
      plotSize,
      sizeType,
      rate,
      idcCharges,
      plcCharges,
      totalPrice,
      status: 'available', // Assuming default status is available
    };

    block.units.push(newUnit);

    await project.save();

    res.status(201).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error adding unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/markUnitHold/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      console.error("Project not found");
      return res.status(404).json({ error: "Project not found" });
    }

    const block = project.blocks.id(blockId);

    if (!block) {
      console.error("Block not found");
      return res.status(404).json({ error: "Block not found" });
    }

    const unit = block.units.id(unitId);

    if (!unit) {
      console.error("Unit not found");
      return res.status(404).json({ error: "Unit not found" });
    }

    // Update unit status
    unit.status = "hold";
    await project.save();

    console.log("Unit marked as hold successfully");
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error marking unit as hold:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//available api

app.put("/markUnitAvailable/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      console.error("Project not found");
      return res.status(404).json({ error: "Project not found" });
    }

    const block = project.blocks.id(blockId);

    if (!block) {
      console.error("Block not found");
      return res.status(404).json({ error: "Block not found" });
    }

    const unit = block.units.id(unitId);

    if (!unit) {
      console.error("Unit not found");
      return res.status(404).json({ error: "Unit not found" });
    }

    // Update unit status
    unit.status = "available";
    await project.save();

    console.log("Unit marked as available successfully");
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error marking unit as available:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to mark a unit as sold
app.put("/markUnitSold/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      console.error("Project not found");
      return res.status(404).json({ error: "Project not found" });
    }

    const block = project.blocks.id(blockId);

    if (!block) {
      console.error("Block not found");
      return res.status(404).json({ error: "Block not found" });
    }

    const unit = block.units.id(unitId);

    if (!unit) {
      console.error("Unit not found");
      return res.status(404).json({ error: "Unit not found" });
    }

    // Update unit status
    unit.status = "sold";
    await project.save();

    console.log("Unit marked as sold successfully");
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error marking unit as sold:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete a project
app.delete("/deleteProject/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.remove();

    res.status(200).json({ status: "ok", message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Endpoint to delete a block from a project
app.delete("/deleteBlock/:projectId/:blockId", async (req, res) => {
  const { projectId, blockId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Find the block by id and remove it
    project.blocks.id(blockId).remove();

    await project.save();

    res.status(200).json({ status: "ok", message: "Block deleted successfully" });
  } catch (error) {
    console.error("Error deleting block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to delete a unit from a block
app.delete("/deleteUnit/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const block = project.blocks.id(blockId);

    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    // Find the unit by id and remove it from the block
    block.units.id(unitId).remove();

    await project.save();

    res.status(200).json({ status: "ok", message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get the count of units in a block
app.get("/getUnitCount/:projectId/:blockId", async (req, res) => {
  const { projectId, blockId } = req.params;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      console.error("Project not found");
      return res.status(404).json({ error: "Project not found" });
    }

    const block = project.blocks.id(blockId);

    if (!block) {
      console.error("Block not found");
      return res.status(404).json({ error: "Block not found" });
    }

    const unitCount = block.units.length;

    res.status(200).json({ status: "ok", unitCount });
  } catch (error) {
    console.error("Error getting unit count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Add customer
// Endpoint to add a customer
app.post("/addCustomer", async (req, res) => {
  const {
    name,
    fatherOrHusbandName,
    address,
    aadharNumber,
    panNumber,
    mobileNumber,
    income,
    email,
    propertyType,
    selectedProject,
    selectedBlock,
    selectedUnit,
    discount,
    paymentPlan,
    bookingDate,
    bookingType,
    sendEmail,
    paymentReceived
  } = req.body;

  try {
    // Check if the customer already exists
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(400).json({ error: "Customer already exists" });
    }

    // Create a new customer
    const newCustomer = await Customer.create({
      name,
      fatherOrHusbandName,
      address,
      aadharNumber,
      panNumber,
      mobileNumber,
      income,
      email,
      propertyType,
      project: selectedProject,
      block: selectedBlock,  
      plotOrUnit: selectedUnit,
      discount,
      paymentPlan,
      bookingDate,
      bookingType,
      sendEmail,
      paymentReceived
    });

    res.status(201).json({ status: "ok", data: newCustomer });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// View Castumer
app.get('/Viewcustomer', async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
