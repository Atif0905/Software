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
const Logo = require("./Models/Companylogo");
const ChannelPartner = require("./Models/ChanelPartner");
const expenseRoutes = require("./Router/expenseRoutes");
const paymentPlanRoutes = require("./Router/paymentPlanRoutes");
const uploadProjects = multer({ dest: "uploads/" });
const installmentRoutes = require("./Router/installmentRoutes");
const paymentDetailRoutes = require("./Router/paymentDetailRoutes");
const customerRoutes = require("./Router/customerRoutes");
const { getDatabaseURI, connectToDatabase } = require("./db");
const path = require("path");
const Mailcontent = require('./Models/MailContent');
const Requesthold = require("./Router/RequestHold")
const Returnedpayments = require('./Router/Returnexpenseroutes')
app.use(cors()); 
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
const { PORT, MONGODB_URI, JWT_SECRET } = process.env;
app.use(express.json());
app.use('/Return-Payment', Returnedpayments);
app.use("/expenses", expenseRoutes);
app.use("/paymentPlans", paymentPlanRoutes);
app.use("/DueDate", installmentRoutes);
app.use("/paymentDetails", paymentDetailRoutes);
app.use("/customer", customerRoutes);
app.use("/createrequest",Requesthold )
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
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
app.get("/getAllUser", async (req, res) => {
  try {
    const allUsers = await User.find({});
    const allSubAdmins = await SubAdmin.find({});
    const combinedData = {
      users: allUsers,
      subAdmins: allSubAdmins
    };  

    res.send({ status: "ok", data: combinedData });
  } catch (error) {
    console.error('Error fetching users and subadmins:', error);
    res.status(500).send({ status: "error", error: "Failed to fetch details" });
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
            const projectData = results.data[0]; 
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
            const blockData = results.data[0]; 
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
        text: `On behalf of Test  Private Limited, we truly appreciate your recent association with us for your booking of a unit in our project ${projectNameStr}`,
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

    const projectName = typeof ProjectName === 'object' ? ProjectName.name : ProjectName;
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

      We are delighted to welcome you to our Project  ${projectName} ! Thank you for
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
      
      
      
      Test Pvt Ltd
      CRM HEAD
      Dummy
      +91-0000000000
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
app.post('/chanelpartner', async (req, res) => {
  try {
    const { customerFirstName, customerSecondName, customerEmail, gender, phoneNumber, referredBy } = req.body;
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
app.get('/chanelpartner', async (req, res) => {
  try {
    const partners = await ChannelPartner.find();
    res.status(200).json(partners);
  } catch (error) {
    console.error('Error fetching Channel Partners:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
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
  console.log('Request received:', req.body);
  const { email } = req.body;
  if (!email) {
    console.log('Missing email, subject, or message');
    return res.status(400).send({ error: 'Missing required fields' });
  }
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


app.post("/register", async (req, res) => {
  const { companyName, fname, lname, email, password, userType, UniqueID } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: "Company name is required" });
  }

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Dynamically connect to the company's database
    const databaseName = companyName.toLowerCase().replace(/\s+/g, "-");
    await connectToDatabase(databaseName);

    // Use existing 'User' model if already compiled
    const CompanyUser =
      mongoose.models.UserInfo || // Check if 'User' model exists
      mongoose.model(
        "UserInfo",
        new mongoose.Schema({
          fname: String,
          lname: String,
          email: { type: String, unique: true },
          password: String,
          userType: String,
          UniqueID: String,
        })
      );

    // Check if the user already exists
    const oldUser = await CompanyUser.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ error: "User already exists in this company" });
    }

    // Create the user in the company-specific database
    await CompanyUser.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
      UniqueID,
    });

    res.status(201).send({
      status: "ok",
      message: `User registered successfully in database: ${databaseName}`,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({
      status: "error",
      message: "Registration failed. See server logs for details.",
    });
  }
});

// User Login Route
app.post("/login-user", async (req, res) => {
  const { email, password, companyName } = req.body;

  try {
    // Connect to the company's database
    await connectToDatabase(companyName);

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: "error", error: "Invalid Password" });
    }

    // Generate token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET || "ADDaDmininWomeki", {
      expiresIn: "1h",
    });

    // Log login
    logChange("login", { email });

    // Respond with token
    return res.json({ status: "ok", data: { token, message: "Login successful!" } });
  } catch (error) {
    console.error("Error in /login-user:", error);
    res.status(500).json({ status: "error", error: "Login failed" });
  }
});



app.post("/SubAdminLogin", async (req, res) => {
  const { email, password, companyName } = req.body;

  try {
    // Ensure companyName is provided
    if (!companyName) {
      return res.status(400).json({ status: "error", error: "Company name is required" });
    }

    // Connect to the specific company's database
    const dbConnection = await connectToDatabase(companyName);

    // Define the SubAdmin schema and model dynamically
    const SubAdmin = dbConnection.model(
      "SubAdmin",
      new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
      })
    );

    // Find SubAdmin by email
    const subAdmin = await SubAdmin.findOne({ email });
    if (!subAdmin) {
      return res.status(404).json({ status: "error", error: "SubAdmin not found" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, subAdmin.password);
    if (!isMatch) {
      return res.status(401).json({ status: "error", error: "Incorrect password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: subAdmin.email, companyName },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Respond with the token
    res.json({ status: "ok", data: { token } });
  } catch (error) {
    console.error("Error in /SubAdminLogin:", error);
    res.status(500).json({ status: "error", error: "Login failed" });
  }
});

// SubAdmin Register
app.post('/SubAdminRegister', async (req, res) => {
  try {
    const { fname, lname, email, password, userType, AssgProject } = req.body;

    // Validate all required fields
    if (!fname || !lname || !email || !password || !userType || !AssgProject) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if SubAdmin already exists
    const existingSubAdmin = await SubAdmin.findOne({ email });
    if (existingSubAdmin) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save a new SubAdmin
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
    console.error('Error in /SubAdminRegister:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
});


app.post("/userData", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ status: "error", message: "Token not provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ADDaDmininWomeki");
    const userEmail = decoded.email;
    const [userData, subAdminData] = await Promise.all([
      User.findOne({ email: userEmail }),
      SubAdmin.findOne({ email: userEmail }),
    ]);
    const data = userData || subAdminData;
    if (!data) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.json({ status: "ok", data });
  } catch (error) {
    console.error("JWT Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ status: "error", message: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ status: "error", message: "Invalid token" });
    }
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.post('/logo', upload.array('files', 1), async (req, res) => {
  try {
    const existingLogo = await Logo.findOne();
    if (existingLogo) {
      return res.status(400).json({ error: 'A logo already exists. Use PUT to update it.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const files = req.files.map((file) => file.path);
    const logoDoc = await Logo.create({ files });
    res.json(logoDoc);
  } catch (error) {
    console.error('Error uploading logo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/logo', async (req, res) => {
  try {
    const logoDoc = await Logo.findOne(); 
    res.json(logoDoc); 
  } catch (error) {
    console.error('Error fetching logo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/logo', upload.single('files'), async (req, res) => {
  try {
    let filePath = req.file ? req.file.path : 'public/default.jpg';

    const logoDoc = await Logo.findOneAndUpdate(
      {},
      { files: [filePath] },
      { new: true, upsert: true } 
    );

    res.json(logoDoc);
  } catch (error) {
    console.error('Error updating logo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/Mailcontent', async (req, res) => {
  try {
    const mailContent = await Mailcontent.findOne({});
    if (!mailContent) {
      return res.status(404).json({ error: 'Mail content not found.' });
    }
    res.json(mailContent);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the mail content.' });
  }
});
app.put('/Mailcontent', async (req, res) => {
  const { Subject, Body, Lastdata } = req.body;

  // Validate required fields
  if (!Subject || !Body || !Lastdata) {
    return res.status(400).json({ error: 'Subject, Body, and Lastdata are required fields.' });
  }

  try {
    // Update or create the single document
    const updatedMailcontent = await Mailcontent.findOneAndUpdate(
      {}, // No filter to ensure a singleton document
      { Subject, Body, Lastdata },
      { new: true, upsert: true } // Create if it doesn't exist
    );

    res.json({ message: 'Mail content updated successfully', mailContent: updatedMailcontent });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the mail content.' });
  }
});
