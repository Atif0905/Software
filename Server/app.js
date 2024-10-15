require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubAdmin = require('./Models/SubAdmin');
const Project = require("./Models/UploadProjects");
const pdfMakePrinter = require("pdfmake/src/printer");
const nodemailer = require("nodemailer");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./Models/CreatePost");
const Blog = require("./Models/Createblog");
const ChannelPartner = require("./Models/ChanelPartner");
const expenseRoutes = require("./Router/expenseRoutes");
const paymentPlanRoutes = require("./Router/paymentPlanRoutes");
const uploadProjects = multer({ dest: "uploads/" });
const installmentRoutes = require("./Router/installmentRoutes");
const paymentDetailRoutes = require("./Router/paymentDetailRoutes");
const customerRoutes = require("./Router/customerRoutes");
// const cors = require('cors');
app.use(cors()); // Allows all origins
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
const { PORT, MONGODB_URI, JWT_SECRET } = process.env;
app.use(express.json());

app.use("/expenses", expenseRoutes);
app.use("/paymentPlans", paymentPlanRoutes);
app.use("/DueDate", installmentRoutes);
app.use("/paymentDetails", paymentDetailRoutes);
app.use("/customer", customerRoutes);
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((e) => console.log(e));
require("./userDetails");
const User = mongoose.model("UserInfo");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/webp") {
    cb(null, true);
  } else {
    cb(new Error("Only .webp files are allowed"));
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
module.exports = upload;

// Logging function
const logChange = (action, userData) => {
  const logEntry = {
    timestamp: new Date(),
    action,
    user: userData.email || "Unknown",
    details: userData,
  };

  fs.appendFile(
    path.join(__dirname, "changeLogs.txt"),
    JSON.stringify(logEntry) + "\n",
    (err) => {
      if (err) console.error("Error writing log:", err);
    }
  );
};
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
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;
  const results = {};
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);
  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});
app.post("/uploadProject", uploadProjects.single("file"), async (req, res) => {
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
    Posessionfinaldate,
  } = req.body;
  if (req.file) {
    try {
      const csvFilePath = req.file.path;
      const fileContent = fs.readFileSync(csvFilePath, "utf8");
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
            Posessionfinaldate =
              projectData.Posessionfinaldate || Posessionfinaldate;
          }
        },
      });
      fs.unlinkSync(csvFilePath);
    } catch (error) {
      console.error("Error processing CSV file:", error);
      return res.status(500).json({ error: "Error processing CSV file" });
    }
  }
  try {
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
      Posessionfinaldate,
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
app.post("/addBlock/:projectId", upload.single("file"), async (req, res) => {
  const { projectId } = req.params;
  let {
    name,
    totalPlotInBlock,
    plotSize,
    basicRateOfBlock,
    idcRateOfBlock,
    edcRateOfBlock,
  } = req.body;
  if (req.file) {
    try {
      const csvFilePath = req.file.path;
      const fileContent = fs.readFileSync(csvFilePath, "utf8");

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
        },
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
app.post("/addUnit/:projectId/:blockId",
  upload.single("file"),
  async (req, res) => {
    const { projectId, blockId } = req.params;
    let {
      name,
      plotSize,
      sizeType,
      rate,
      idcCharges,
      plcCharges,
      totalPrice,
      edcPrice,
    } = req.body;

    // Check if a CSV file is uploaded
    if (req.file) {
      try {
        const csvFilePath = req.file.path;
        const fileContent = fs.readFileSync(csvFilePath, "utf8");

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
          },
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
        status: "available",
      };

      block.units.push(newUnit);
      await project.save();

      res.status(201).json({ status: "ok", data: project });
    } catch (error) {
      console.error("Error adding unit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
app.put("/editUnit/:projectId/:blockId/:unitId", async (req, res) => {
  const { projectId, blockId, unitId } = req.params;
  const { rate, idcCharges, plcCharges, totalPrice, edcPrice } = req.body;
  try {
    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(blockId) ||
      !mongoose.Types.ObjectId.isValid(unitId)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid project, block, or unit ID" });
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
    res
      .status(200)
      .json({
        status: "ok",
        message: "Unit updated successfully",
        data: project,
      });
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
    res
      .status(200)
      .json({ status: "ok", message: "Project deleted successfully" });
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
    res
      .status(200)
      .json({ status: "ok", message: "Block deleted successfully" });
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

    res
      .status(200)
      .json({ status: "ok", message: "Unit deleted successfully" });
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

const generatePdf = async (
  customerName,
  customerAddress,
  unitName,
  ProjectName,
  area,
  blockName
) => {
  const projectNameStr = String(ProjectName);

  const fonts = {
    Roboto: {
      normal:
        "node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf",
      bold: "node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf",
      italics:
        "node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf",
      bolditalics:
        "node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf",
    },
  };
  const printer = new pdfMakePrinter(fonts);
  const docDefinition = {
    content: [
      { image: "./logo.png", width: 160, height: 90 },
      { text: "WELCOME LETTER", style: "header" },
      { text: "\n" },
      { text: `To,\nMr / Mrs : ${customerName}`, style: "normal" },
      {
        text: `Date : ${new Date().toLocaleDateString()}`,
        style: "headerDate",
      },
      { text: ` ${customerAddress}` },
      {
        text: `${blockName} Block Unit No. : ${unitName}\nArea : ${area} sqyd (Approx)\n\n`,
        style: "normal",
      },
      { text: "RE: Thank you for your Patronage!\n", style: "headersub" },
      {
        text: `On behalf of WOMEKI INVESTORS CLUB Private Limited, we truly appreciate your recent association with us for your booking of a unit in our project ${projectNameStr}`,
        style: "normal",
      },
      {
        text: "We value your trust in our company, and we will do our best to meet your service expectations. Rest assured, with its location advantage and a truly low price at the moment, you will receive good appreciation on your purchase. My staff will always extend all its help to increase your customer experience and to make sure that you have a very good experience dealing with us.\n\n",
        style: "normal",
      },
      {
        text: `Your association is absolutely valued and we definitely look forward to your patronage. Also, any references from you would be great support and will help us give you an amazingly good neighborhood at “${projectNameStr}”\n\n`,
        style: "normal",
      },
      {
        text: "Thank you once again, for your booking. If you have any queries, please don’t hesitate to call us on +91-9871127024\n\n",
        style: "normal",
      },
      { text: "Sincerely,\n\n", style: "normal" },
      { text: "WOMEKI INVESTORS CLUB Private Limited\n", style: "normal" },
    ],
    styles: {
      header: {
        alignment: "center",
        fontSize: 14,
        fonts: "Roboto",
        bold: true,
        decoration: "underline",
        margin: [0, 10, 0, 20],
      },
      headerDate: {
        alignment: "right",
        fontSize: 14,
        fonts: "Roboto",
        bold: true,
      },
      headersub: {
        alignment: "left",
        fontSize: 14,
        fonts: "Roboto",
        bold: true,
        margin: [0, 10, 0, 20],
      },
      normal: {
        fontSize: 12,
        fonts: "Roboto",
        margin: [0, 0, 0, 10],
      },
    },
  };
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  const chunks = [];
  return new Promise((resolve, reject) => {
    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    pdfDoc.on("end", () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });
    pdfDoc.on("error", (err) => {
      reject(err);
    });
    pdfDoc.end();
  });
};
app.post("/send-email", async (req, res) => {
  try {
    const {
      to,
      subject,
      customerName,
      customerAddress,
      unitName,
      unitArea,
      ProjectName,
      blockName,
    
    } = req.body;

    // Check if ProjectName is an object and extract the name
    const projectName = typeof ProjectName === 'object' ? ProjectName.name : ProjectName;
    // const BlockName = typeof  blockName === 'object' ? blockName.name : BlockName ;
    console.log(customerName);
    const pdfBuffer = await generatePdf(
      customerName,
      customerAddress,
      unitName,
      projectName,  // Pass the extracted project name
      unitArea,
      blockName,
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "atif123n@gmail.com",  // Your email address
        pass: "pudn xzbg yfdj qozn",
      },
    });
    const mailOptions = {
      from: "atif123n@gmail.com",
      to,
      subject,
      text: `Dear ${customerName},

      We are delighted to welcome you to our Project ${projectName} ! Thank you for
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
      Vijeta
      +91-9911140024
      `,
      attachments: [
        {
          filename: "welcome_letter.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});
app.post("/createpost", upload.array("files", 5), async (req, res) => {
  const files = req.files.map((file) => file.path);
  const { projectname, address, content, category, subcategory, price, type } =
    req.body;
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
app.get("/createpost", async (req, res) => {
  res.json(await Post.find());
});
app.put(
  "/editpost/:postId",
  uploadMiddleware.single("cover"),
  async (req, res) => {
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
      console.error("Error editing post:", error);
      res.status(500).send("Error editing post");
    }
  }
);
app.delete("/deletepost/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    await Post.findByIdAndDelete(postId);

    res.send("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
});
app.post("/createblog", upload.array("files", 5), async (req, res) => {
  try {
    const files = req.files.map((file) => file.path);
    const {
      name,
      description,
      content1,
      content2,
      content3,
      content4,
      content5,
      category,
    } = req.body;

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
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/createblog", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// POST /chanelpartner - Create a new ChannelPartner
app.post('/chanelpartner', async (req, res) => {
  try {
    const { customerFirstName, customerSecondName, customerEmail, gender, phoneNumber, referredBy } = req.body;

    // Basic validation
    if (!customerFirstName || !customerSecondName || !customerEmail || !gender || !phoneNumber || !referredBy) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newChannelPartner = new ChannelPartner(req.body);
    const savedChannelPartner = await newChannelPartner.save();

    res.status(201).json(savedChannelPartner);
  } catch (error) {
    console.error('Error creating Channel Partner:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET /chanelpartner - Get all ChannelPartners
app.get('/chanelpartner', async (req, res) => {
  try {
    const partners = await ChannelPartner.find();
    res.status(200).json(partners);
  } catch (error) {
    console.error('Error fetching Channel Partners:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET /chanelpartner/:uniqueId - Get a ChannelPartner by uniqueId
app.get('/chanelpartner/:uniqueId', async (req, res) => {
  try {
    const { uniqueId } = req.params;
    const partner = await ChannelPartner.findOne({ uniqueId });

    if (!partner) {
      return res.status(404).json({ error: 'Channel Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    console.error('Error fetching Channel Partner:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
app.post('/reminder-email', (req, res) => {
  console.log('Request received:', req.body);  // Log the request body
  
  const { email } = req.body;
  
  // Step 1: Validate the request
  if (!email) {
    console.log('Missing email, subject, or message');
    return res.status(400).send({ error: 'Missing required fields' });
  }

  // Step 2: Create the Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "atif123n@gmail.com",  // Your email address
      pass: "pudn xzbg yfdj qozn",  // App-specific password for the email account
    },
  });

  // Step 3: Configure the email options
  const mailOptions = {
    from: 'atif123n@gmail.com',      // Sender's email
    to: email,                   // Recipient's email (from frontend)
    subject: "Payment reminder " ,            // Subject of the email (from frontend)
    text: "Kindly pay your installement on time"                // Email message (from frontend)
  };

  // Step 4: Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);  // Log error
      return res.status(500).send({ error: 'Error sending email' });
    } else {
      console.log('Email sent:', info.response);   // Log successful response
      res.status(200).send({ success: 'Email sent successfully', info });
    }
  });
});
// POST: Register a new SubAdmin
app.post('/SubAdminRegister', async (req, res) => {
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
// app.post('/SubAdminLogin', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and Password are required.' });
//     }

//     const subAdmin = await SubAdmin.findOne({ email });
//     if (!subAdmin) {
//       return res.status(400).json({ message: 'Invalid email or password.' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, subAdmin.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password.' });
//     }

//     const token = jwt.sign(
//       { id: subAdmin._id, email: subAdmin.email, userType: subAdmin.userType },
//       process.env.JWT_SECRET || 'default_secret',
//       { expiresIn: '1d' }
//     );

//     res.json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error.' });
//   }
// });

// Sub-Admin Login Route
app.post("/SubAdminLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const subAdmin = await SubAdmin.findOne({ email });
    if (!subAdmin) 
      return res.status(404).json({ status: "error", error: "SubAdmin not found" });

    const isMatch = await bcrypt.compare(password, subAdmin.password);
    if (!isMatch) 
      return res.status(401).json({ status: "error", error: "Incorrect password" });

    const token = jwt.sign({ email: subAdmin.email }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ status: "ok", data: { token } }); // Consistent token structure
  } catch (error) {
    console.error('Error in /SubAdminLogin:', error);
    res.status(500).json({ status: "error", error: "Login failed" });
  }
});

// User Login Route
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(404).json({ status: "error", error: "User Not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(401).json({ status: "error", error: "Invalid Password" });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ status: "ok", data: { token } }); // Consistent token structure
  } catch (error) {
    console.error('Error in /login-user:', error);
    res.status(500).json({ status: "error", error: "Login failed" });
  }
});

// User Data Route
app.post('/userData', async (req, res) => {
  const { token } = req.body;

  console.log('Token received:', token); // Debugging

  if (!token) {
    return res.status(400).json({ status: 'error', data: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userEmail = decoded.email;

    const [userData, subAdminData] = await Promise.all([
      User.findOne({ email: userEmail }),
      SubAdmin.findOne({ email: userEmail }),
    ]);

    const data = userData || subAdminData;
    if (!data) {
      return res.status(404).json({ status: 'error', data: 'User not found' });
    }

    res.json({ status: 'ok', data });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.json({ status: 'error', data: 'Token expired' });
    }
    console.error('Error in /userData:', error);
    res.status(500).json({ status: 'error', data: 'Internal Server Error' });
  }
});