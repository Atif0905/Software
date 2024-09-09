const mongoose = require('mongoose');

// ChanelPartner Schema
const ChanelPartnerSchema = new mongoose.Schema({
  customerfirstName: {
    type: String,
    required: true,
  },
  customerSecondName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
  },
  gender: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  Referedby: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,    
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  }
});

ChanelPartnerSchema.pre("save", async function (next) {
    if (this.isNew) {
      try {
        const scenarioNumber =
          (await mongoose.models.Channel.countDocuments()) + 1;
        this.uniqueId = `WIC Chanel0${scenarioNumber}`;
        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
  });
  const Chanel = mongoose.model("Chanel", ChanelPartnerSchema);
  module.exports = Chanel;
