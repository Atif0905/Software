require('dotenv').config(); // Load environment variables from .env file
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Project = require('./Models/UploadProjects');
const Customer = require('./Models/CastumerUpload')
const PaymentPlan = require('./Models/PaymentPlan');
const Payment = require('./Models/PaymentRecive')
const pdfMakePrinter = require('pdfmake/src/printer');
const nodemailer = require('nodemailer');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});
const fs = require('fs');
const Post = require('./Models/CreatePost')
const Blog = require('./Models/Createblog');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));



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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/webp') {
    cb(null, true);
  } else {
    cb(new Error('Only .webp files are allowed'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
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
    res.status(500).json({ error: "Internal server error" });
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
  const { name, plotSize, sizeType, rate, idcCharges, plcCharges, totalPrice,edcPrice } = req.body;

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
      edcPrice,
      status: 'available', // Assuming default status is available
    };

    block.units.push(newUnit);

    await project.save();

    res.status(201).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error adding unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Endpoint to edit unit including its charges
app.put("/editUnit/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;
  const {  rate, idcCharges, plcCharges, totalPrice, edcPrice } = req.body;

  try {
    // Validate ObjectIDs
    if (!mongoose.Types.ObjectId.isValid(projectId) ||
        !mongoose.Types.ObjectId.isValid(blockId) ||
        !mongoose.Types.ObjectId.isValid(unitId)) {
      return res.status(400).json({ error: "Invalid project, block, or unit ID" });
    }

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

    // Update unit details including charges
    unit.rate = rate;
    unit.idcCharges = idcCharges;
    unit.plcCharges = plcCharges;
    unit.totalPrice = totalPrice;
    unit.edcPrice = edcPrice;

    await project.save();

    res.status(200).json({ status: "ok", message: "Unit updated successfully", data: project });
  } catch (error) {
    console.error("Error editing unit:", error);
    res.status(500).json({ error: "Internal server error" });
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
    paymentPlan, // Assuming paymentPlan is an array of payment plan objects
    bookingDate,
    bookingType,
    sendEmail,
  } = req.body;

  try {
    // Generate a scenario number
    const scenarioNumber = await Customer.countDocuments() + 1;

    // Generate unique ID
    const customerId = `WI0${scenarioNumber}`;

    // Create a new customer with payment plan names
    const newCustomer = await Customer.create({
      customerId, // Add the generated ID
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
      paymentPlan, // Ensure paymentPlan is an array of strings (names)
      bookingDate,
      bookingType,
      sendEmail,
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
// Search by Adhar 
app.get("/viewcustomer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// payment plan 
// Assuming you have a route handler for creating payment plans
app.post('/createPaymentPlan', async (req, res) => {
  try {
    const { type, planName, numInstallments, installments } = req.body;

    if (!type || !planName || !numInstallments || !installments) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const paymentPlan = new PaymentPlan({
      type: type,
      planName: planName,
      numInstallments: numInstallments,
      installments: installments,
    });

    await paymentPlan.save();

    res.status(201).json({ message: 'Payment plan created successfully', paymentPlan });
  } catch (error) {
    console.error('Error creating payment plan:', error);
    res.status(500).json({ error: 'An error occurred while creating the payment plan' });
  }
});

//view payment plan endpoint

app.get('/paymentPlans', async (req, res) => {
  try {
    // Fetch all payment plans from the database
    const paymentPlans = await PaymentPlan.find();

    // Send the response with the fetched payment plans
    res.status(200).json({ paymentPlans });
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    res.status(500).json({ error: 'An error occurred while fetching payment plans' });
  }
});

// Endpoint to handle payment details
// Endpoint to add payment details
app.post("/paymentDetails", async (req, res) => {
  const { customerId, paymentType, paymentMode, amount, reference, comment, aadharNumber, PaymentDate } = req.body;

  try {
    // Check if required fields are provided
    if (!paymentType || !reference || !customerId) {
      return res.status(400).json({ error: "PaymentType, Reference, and CustomerId are required fields" });
    }

    // Create a new payment record
    const payment = await Payment.create({
      customerId,
      paymentType,
      paymentMode,
      amount,
      reference,
      comment,
      aadharNumber,
      PaymentDate
    });

    res.status(201).json({ status: "ok", message: "Payment details added successfully", data: payment });
  } catch (error) {
    console.error("Error adding payment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Endpoint to get all payment details
app.get("/paymentDetails", async (req, res) => {
  try {
    // Fetch all payment details from the database
    const payments = await Payment.find();

    res.status(200).json({ status: "ok", data: payments });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/paymentDetails/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch payment details for the specified Aadhar number from the database
    const payments = await Payment.find({ customerId });

    if (payments.length === 0) {
      return res.status(404).json({ error: "No payments found for the specified Aadhar number" });
    }

    res.status(200).json({ status: "ok", data: payments });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const generatePdf = async (customerName, customerAddress, unitNo, ProjectName, area, customerfather) => {
  const fonts = {
    Roboto: {
      normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
      bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
      italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
      bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
    }
  };

  const printer = new pdfMakePrinter(fonts);
  const docDefinition = {
    content: [
      { image: './logo.png', width: 160, height: 90 },
      { text: 'WELCOME LETTER', style: 'header' },
      { text: '\n' },
      { text: `To,\nMr / Mrs : ${customerName}`, style: 'normal' },
      { text: `Date : ${new Date().toLocaleDateString()}`, style: 'headerDate' },
      { text: `${customerfather} ${customerAddress}` },
      { text: `Unit No. : ${unitNo}\nArea : ${area} sqyd (Approx)\n\n`, style: 'normal' },
      { text: 'RE: Thank you for your Patronage!\n', style: 'headersub' },
      { text: `On behalf of WOMEKI INVESTORS CLUB Private Limited, we truly appreciate your recent association with us for your booking of a unit in our project ${ProjectName}`, style: 'normal' },
      { text: 'We value your trust in our company, and we will do our best to meet your service expectations. Rest assured, with its location advantage and a truly low price at the moment, you will receive good appreciation on your purchase. My staff will always extend all its help to increase your customer experience and to make sure that you have a very good experience dealing with us.\n\n', style: 'normal' },
      { text: `Your association is absolutely valued and we definitely look forward to your patronage. Also, any references from you would be great support and will help us give you an amazingly good neighborhood at “${ProjectName}”\n\n`, style: 'normal' },
      { text: 'Thank you once again, for your booking. If you have any queries, please don’t hesitate to call us on +91-9871127024\n\n', style: 'normal' },
      { text: 'Sincerely,\n\n', style: 'normal' },
      { text: 'WOMEKI INVESTORS CLUB Private Limited\n', style: 'normal' }
    ],
    styles: {
      header: {
        alignment: 'center',
        fontSize: 14,
        fonts: "Roboto",
        bold: true,
        decoration: 'underline',
        margin: [0, 10, 0, 20]
      },
      headerDate: {
        alignment: 'right',
        fontSize: 14,
        fonts: "Roboto",
        bold: true,
      },
      headersub: {
        alignment: 'left',
        fontSize: 14,
        fonts: "Roboto",
        bold: true,
        margin: [0, 10, 0, 20]
      },
      normal: {
        fontSize: 12,
        fonts: "Roboto",
        margin: [0, 0, 0, 10]
      }
    }
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];

  return new Promise((resolve, reject) => {
    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });
    pdfDoc.on('error', (err) => {
      reject(err);
    });

    pdfDoc.end();
  });
};

// Assuming you already have the route for sending emails
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, customerName, customerAddress, unitName, unitArea,ProjectName } = req.body;
    console.log(customerName)

    // Generate PDF document
    const pdfBuffer = await generatePdf(customerName, customerAddress, unitName, unitArea);

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'crm@wic.org.in', // your Gmail address
        pass: 'bpda usjb jbiz qrkb ' // your Gmail password
      }
    });

    // Define email content with PDF attachment
    const mailOptions = {
      from: 'crm@wic.org.in',
      to,
      subject,
      text: `Dear ${customerName},

      We are delighted to welcome you to our Project ${ProjectName} ! Thank you for
      booking a plot in our project and trusting us with your dream of owning a
      property in our township. We promise to make your experience with us a
      delightful one.
      
      We take pride in delivering the best-in-class services and amenities to our
      customers. As part of our commitment to providing exceptional customer
      service, we will ensure that you are updated with the latest developments of
      the project, and we will be there for you every step of the way.
      
      Our team of experts is dedicated to delivering a hassle-free and seamless
      experience throughout the project's journey. We understand that investing in
      a property is a significant decision, and we aim to make it a memorable one
      for you.
      
      
      Once again, thank you for choosing us as your partner in this journey. We
      look forward to creating a beautiful and fulfilling experience for you and
      your family.
      
      
      Best regards,
      
      
      
      WOMEKI INVESTORS CLUB Pvt Ltd
      CRM HEAD
      Anjali Bhardwaj
      +91-9911140024
      `,
      attachments: [
        {
          filename: 'welcome_letter.pdf', // Name of the attachment
          content: pdfBuffer, // Content of the PDF file
          contentType: 'application/pdf'
        }
      ]
    };


    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

app.post('/createpost', upload.array('files', 5), async (req, res) => {
  const files = req.files.map(file => file.path);
  const { projectname, address, content, category, subcategory, price, type } = req.body;

  // Assuming Post is your Mongoose model or ORM model
  const postDoc = await Post.create({
    projectname,
    address,
    content,
    category,
    subcategory,
    price,
    type,
    files: files, // Assuming you have a field in your model to store file paths
  });

  res.json(postDoc);
});
app.get('/createpost', async(req, res) => {
  res.json(await Post.find());
});

app.put('/editpost/:postId', uploadMiddleware.single('cover'), async (req, res) => {
  try {
      const postId = req.params.postId;
      const { title, summary, content, category } = req.body;
      let cover = req.file ? req.file.path : undefined;

      const updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, summary, content, category, cover },
          { new: true }
      );

      res.json(updatedPost);
  } catch (error) {
      console.error('Error editing post:', error);
      res.status(500).send('Error editing post');
  }
});

app.delete('/deletepost/:postId', async (req, res) => {
  try {
      const postId = req.params.postId;

      await Post.findByIdAndDelete(postId);

      res.send('Post deleted successfully');
  } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send('Error deleting post');
  }
});
app.post('/createblog', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files.map(file => file.path);
    const { name, description, content1, content2, content3, content4, content5, category } = req.body;

    const blogDoc = await Blog.create({
      name,
      description,
      content1,
      content2,
      content3,
      content4,
      content5,
      category,
      files: files,
    });

    res.json(blogDoc);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to fetch existing blogs
app.get('/createblog', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});