require('dotenv').config();
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
const Installment = require('./Models/Duedate');
const Expense = require('./Models/Expense')


const uploadProjects = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));
const { PORT, MONGODB_URI, JWT_SECRET } = process.env;
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
  // app.post("/uploadProject", async (req, res) => {
  // const { name, description, totalLand, GST, Bsprate, AccountNo, Bank, IFSC, Payable ,CompanyName, Posessionfinaldate } = req.body;
  //   try {
  //     const project = await Project.create({ name,  description, totalLand, GST, AccountNo, Bank, IFSC, Payable ,CompanyName, Bsprate, Posessionfinaldate});
  //     res.status(201).json({ status: "ok", data: project });
  //   } catch (error) {
  //     console.error("Error uploading project:", error);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // });












  app.post("/uploadProject", uploadProjects.single('file'), async (req, res) => {
    let {
      name,
      description,
      totalLand,
      GST,
      Bsprate,
      AccountNo,
      Bank,
      IFSC,
      Payable,
      CompanyName,
      Posessionfinaldate
    } = req.body;
  
    // Check if a file is uploaded
    if (req.file) {
      try {
        // Read and parse the CSV file
        const csvFilePath = req.file.path;
        const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  
        // Parse CSV content
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            if (results.data && results.data.length > 0) {
              const projectData = results.data[0]; // Assuming a single project per CSV file
              name = projectData.name || name;
              description = projectData.description || description;
              totalLand = projectData.totalLand || totalLand;
              GST = projectData.GST || GST;
              Bsprate = projectData.Bsprate || Bsprate;
              AccountNo = projectData.AccountNo || AccountNo;
              Bank = projectData.Bank || Bank;
              IFSC = projectData.IFSC || IFSC;
              Payable = projectData.Payable || Payable;
              CompanyName = projectData.CompanyName || CompanyName;
              Posessionfinaldate = projectData.Posessionfinaldate || Posessionfinaldate;
            }
          }
        });
  
        // Delete the file after processing
        fs.unlinkSync(csvFilePath);
      } catch (error) {
        console.error("Error processing CSV file:", error);
        return res.status(500).json({ error: "Error processing CSV file" });
      }
    }
  
    try {
      // Create the project record in the database
      const project = await Project.create({
        name,
        description,
        totalLand,
        GST,
        Bsprate,
        AccountNo,
        Bank,
        IFSC,
        Payable,
        CompanyName,
        Posessionfinaldate
      });
  
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
app.put("/editProject/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { name, description, blocks } = req.body;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    project.name = name;
    project.description = description;
    project.blocks = blocks;
    await project.save();
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error editing project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// app.post("/addBlock/:projectId", async (req, res) => {
//   const { projectId } = req.params;
//   const { name, totalPlotInBlock, plotSize, basicRateOfBlock, idcRateOfBlock, edcRateOfBlock } = req.body;
//   try {
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ error: "Project not found" });
//     }
//     const newBlock = {
//       name,
//       totalPlotInBlock,
//       plotSize,
//       basicRateOfBlock,
//       idcRateOfBlock,
//       edcRateOfBlock,
//     };
//     project.blocks.push(newBlock);
//     await project.save();
//     res.status(201).json({ status: "ok", data: project });
//   } catch (error) {
//     console.error("Error adding block:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
// app.post("/addUnit/:projectId/:blockId", async (req, res) => {
//   const { projectId, blockId } = req.params;
//   const { name, plotSize, sizeType, rate, idcCharges, plcCharges, totalPrice,edcPrice } = req.body;
//   try {
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ error: "Project not found" });
//     }
//     const block = project.blocks.id(blockId);
//     if (!block) {
//       return res.status(404).json({ error: "Block not found" });
//     }
//     const newUnit = {
//       name,
//       plotSize,
//       sizeType,
//       rate,
//       idcCharges,
//       plcCharges,
//       totalPrice,
//       edcPrice,
//       status: 'available', 
//     };
//     block.units.push(newUnit);
//     await project.save();
//     res.status(201).json({ status: "ok", data: project });
//   } catch (error) {
//     console.error("Error adding unit:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


app.post("/addBlock/:projectId", upload.single('file'), async (req, res) => {
  const { projectId } = req.params;
  let { name, totalPlotInBlock, plotSize, basicRateOfBlock, idcRateOfBlock, edcRateOfBlock } = req.body;

  // Check if a CSV file is uploaded
  if (req.file) {
    try {
      const csvFilePath = req.file.path;
      const fileContent = fs.readFileSync(csvFilePath, 'utf8');

      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (results.data && results.data.length > 0) {
            const blockData = results.data[0]; // Assuming a single block per CSV file
            name = blockData.name || name;
            totalPlotInBlock = blockData.totalPlotInBlock || totalPlotInBlock;
            plotSize = blockData.plotSize || plotSize;
            basicRateOfBlock = blockData.basicRateOfBlock || basicRateOfBlock;
            idcRateOfBlock = blockData.idcRateOfBlock || idcRateOfBlock;
            edcRateOfBlock = blockData.edcRateOfBlock || edcRateOfBlock;
          }
        }
      });

      fs.unlinkSync(csvFilePath);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      return res.status(500).json({ error: "Error processing CSV file" });
    }
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

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



app.post("/addUnit/:projectId/:blockId", upload.single('file'), async (req, res) => {
  const { projectId, blockId } = req.params;
  let { name, plotSize, sizeType, rate, idcCharges, plcCharges, totalPrice, edcPrice } = req.body;

  // Check if a CSV file is uploaded
  if (req.file) {
    try {
      const csvFilePath = req.file.path;
      const fileContent = fs.readFileSync(csvFilePath, 'utf8');

      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          if (results.data && results.data.length > 0) {
            const unitData = results.data[0]; // Assuming a single unit per CSV file
            name = unitData.name || name;
            plotSize = unitData.plotSize || plotSize;
            sizeType = unitData.sizeType || sizeType;
            rate = unitData.rate || rate;
            idcCharges = unitData.idcCharges || idcCharges;
            plcCharges = unitData.plcCharges || plcCharges;
            totalPrice = unitData.totalPrice || totalPrice;
            edcPrice = unitData.edcPrice || edcPrice;
          }
        }
      });

      fs.unlinkSync(csvFilePath);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      return res.status(500).json({ error: "Error processing CSV file" });
    }
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const block = project.blocks.id(blockId);
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }

    const newUnit = {
      name,
      plotSize,
      sizeType,
      rate,
      idcCharges,
      plcCharges,
      totalPrice,
      edcPrice,
      status: 'available',
    };

    block.units.push(newUnit);
    await project.save();

    res.status(201).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error adding unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/editUnit/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;
  const {  rate, idcCharges, plcCharges, totalPrice, edcPrice } = req.body;
  try {
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
    unit.status = "hold";
    await project.save();
    console.log("Unit marked as hold successfully");
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error marking unit as hold:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
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
    unit.status = "available";
    await project.save();
    console.log("Unit marked as available successfully");
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error marking unit as available:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
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
    unit.status = "sold";
    await project.save();
    console.log("Unit marked as sold successfully");
    res.status(200).json({ status: "ok", data: project });
  } catch (error) {
    console.error("Error marking unit as sold:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
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
app.delete("/deleteBlock/:projectId/:blockId", async (req, res) => {
  const { projectId, blockId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    project.blocks.id(blockId).remove();
    await project.save();
    res.status(200).json({ status: "ok", message: "Block deleted successfully" });
  } catch (error) {
    console.error("Error deleting block:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
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
    block.units.id(unitId).remove();

    await project.save();

    res.status(200).json({ status: "ok", message: "Unit deleted successfully" });
  } catch (error) {
    console.error("Error deleting unit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
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
app.post("/addCustomer", async (req, res) => {
  const {
    title,name,fatherOrHusbandName,address,aadharNumber,panNumber,mobileNumber,income,email,propertyType,selectedProject,selectedBlock,selectedUnit,discount,paymentPlan, bookingDate,bookingType,sendEmail,name2,fatherOrHusbandName2,address2,aadharNumber2,panNumber2,mobileNumber2,email2,name3,fatherOrHusbandName3,address3,aadharNumber3,panNumber3,mobileNumber3,email3,permanentaddress,EmployeeName,Teamleadname,DOB,DOB2,DOB3,AgreementDate,AllotmentDate,CreatedBy,TenureStartDate,TenureEndDate,Tenuredays
  } = req.body;
  try {
    const scenarioNumber = await Customer.countDocuments() + 1;
    const customerId = `WI0${scenarioNumber}`;
    const newCustomer = await Customer.create({
      customerId, title,name,fatherOrHusbandName,address,aadharNumber,panNumber,mobileNumber,income,email,propertyType,project: selectedProject,block: selectedBlock,plotOrUnit: selectedUnit,discount,paymentPlan,bookingDate,bookingType,sendEmail,name2,fatherOrHusbandName2,address2,aadharNumber2,panNumber2,mobileNumber2,email2,name3,fatherOrHusbandName3,address3,aadharNumber3,panNumber3,mobileNumber3,email3,permanentaddress,EmployeeName,Teamleadname,DOB,DOB2,DOB3,AgreementDate,AllotmentDate,CreatedBy,TenureStartDate,TenureEndDate,Tenuredays
    });
    res.status(201).json({ status: "ok", data: newCustomer });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get('/Viewcustomer', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
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
app.put("/editCustomer/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const existingCustomer = await Customer.findOne({ _id: customerId });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const {
      customerId: updatedCustomerId, title, name, fatherOrHusbandName, address, aadharNumber, panNumber, mobileNumber, email, propertyType, discount, paymentPlan, bookingDate, bookingType, sendEmail, name2, fatherOrHusbandName2, address2, aadharNumber2, panNumber2, mobileNumber2, email2, name3, fatherOrHusbandName3, address3, aadharNumber3, panNumber3, mobileNumber3, permanentaddress, Teamleadname, DOB, DOB2, DOB3, AgreementDate, AllotmentDate, email3
    } = req.body;
    Object.assign(existingCustomer, {
      title, name, fatherOrHusbandName, address, aadharNumber, panNumber, mobileNumber, email, propertyType, discount, paymentPlan, bookingDate, bookingType, sendEmail, name2, fatherOrHusbandName2, address2, aadharNumber2, panNumber2, mobileNumber2, email2, name3, fatherOrHusbandName3, address3, aadharNumber3, panNumber3, mobileNumber3, permanentaddress, Teamleadname, DOB, DOB2, DOB3, AgreementDate, AllotmentDate, email3
    });
    const updatedCustomer = await existingCustomer.save();
    res.json({ status: "ok", data: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post('/DueDate', async (req, res) => {
  const { dueDate, installment, customerId, amount } = req.body;

  if (!dueDate || installment === undefined || customerId === undefined || amount === undefined) {
    return res.status(400).json({ message: 'dueDate, installment, customerId, and amount are required.' });
  }
  try {
    const formattedDueDate = new Date(dueDate).toISOString().split('T')[0];
    const existingInstallment = await Installment.findOne({
      dueDate: formattedDueDate, installment, customerId, amount
    });
    if (existingInstallment) {
      return res.status(409).json({ message: 'Duplicate installment entry. This installment already exists.' });
    }
    const newInstallment = new Installment({
      dueDate: formattedDueDate, installment, customerId, amount
    });
    await newInstallment.save();
    res.status(201).json(newInstallment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating installment', error });
  }
});
app.get('/DueDate', async (req, res) => {
  try {
    const installments = await Installment.find();
    res.json(installments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving installments', error });
  }
});
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
app.get('/paymentPlans', async (req, res) => {
  try {
    const paymentPlans = await PaymentPlan.find();
    res.status(200).json({ paymentPlans });
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    res.status(500).json({ error: 'An error occurred while fetching payment plans' });
  }
});
app.post("/paymentDetails", async (req, res) => {
  const { customerId, paymentType, paymentMode, amount, reference, comment, aadharNumber, PaymentDate } = req.body;
  try {
    if (!paymentType || !reference || !customerId) {
      return res.status(400).json({ error: "PaymentType, Reference, and CustomerId are required fields" });
    }
    const payment = await Payment.create({
      customerId,
      paymentType,
      paymentMode,
      amount,
      reference,
      comment,
      aadharNumber,
      PaymentDate,
    });
    res.status(201).json({ status: "ok", message: "Payment details added successfully", data: payment });
  } catch (error) {
    console.error("Error adding payment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/paymentDetails", async (req, res) => {
  try {
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
app.put("/paymentDetails/:paymentId", async (req, res) => {
  const { paymentId } = req.params;
  const { customerId, paymentMode, amount, reference, comment, PaymentDate } = req.body;
  try {
    if ( !reference || !customerId) {
      return res.status(400).json({ error: " Reference, and CustomerId are required fields" });
    }
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { customerId, paymentMode, amount, reference, comment, PaymentDate,
      },
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json({ status: "ok", message: "Payment details updated successfully", data: updatedPayment });
  } catch (error) {
    console.error("Error updating payment details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.delete("/paymentDetails/:paymentId", async (req, res) => {
  const { paymentId } = req.params;
  try {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    if (!deletedPayment) {
      return res.status(404).json({ error: "Payment not found" });
    }
    res.status(200).json({ status: "ok", message: "Payment details deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment details:", error);
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
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, customerName, customerAddress, unitName, unitArea,ProjectName } = req.body;
    console.log(customerName)
    const pdfBuffer = await generatePdf(customerName, customerAddress, unitName, unitArea);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'crm@wic.org.in',
        pass: 'bpda usjb jbiz qrkb ' 
      }
    });
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
          filename: 'welcome_letter.pdf', 
          content: pdfBuffer, 
          contentType: 'application/pdf'
        }
      ]
    };
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

    const blogDoc = await Blog.create({ name, description, content1, content2, content3, content4, content5, category, files: files,
    });

    res.json(blogDoc);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/createblog', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/expenses', async (req, res) => {
  try {
    const { teamLeadName, expenseSummary, amount, comment, Paydate } = req.body;
    const newExpense = new Expense({ teamLeadName, expenseSummary, amount, comment, Paydate });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense record' });
  }
});
app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense records' });
  }
});
app.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { teamLeadName, expenseSummary, amount, comment, Paydate } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { teamLeadName, expenseSummary, amount, comment, Paydate },
      { new: true } 
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense record not found' });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense record' });
  }
});
app.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Expense record not found' });
    }

    res.status(200).json({ message: 'Expense record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense record' });
  }
});
