const express = require('express');
const router = express.Router();
const Customer = require('../Models/CastumerUpload'); 
router.post('/', async (req, res) => {
  const {
    title, name, fatherOrHusbandName, address, aadharNumber, panNumber, mobileNumber, income, email, propertyType,
    selectedProject, selectedBlock, selectedUnit, discount, paymentPlan, bookingDate, bookingType, sendEmail,
    name2, fatherOrHusbandName2, address2, aadharNumber2, panNumber2, mobileNumber2, email2,
    name3, fatherOrHusbandName3, address3, aadharNumber3, panNumber3, mobileNumber3, email3, permanentaddress,
    EmployeeName, Teamleadname, DOB, DOB2, DOB3, AgreementDate, AllotmentDate, CreatedBy,status
  } = req.body;
  
  try {
    const scenarioNumber = await Customer.countDocuments() + 1;
    const customerId = `WI0${scenarioNumber}`;
    const newCustomer = await Customer.create({
      customerId, title, name, fatherOrHusbandName, address, aadharNumber, panNumber, mobileNumber, income, email, propertyType,
      project: selectedProject, block: selectedBlock, plotOrUnit: selectedUnit, discount, paymentPlan, bookingDate, bookingType, sendEmail,
      name2, fatherOrHusbandName2, address2, aadharNumber2, panNumber2, mobileNumber2, email2,
      name3, fatherOrHusbandName3, address3, aadharNumber3, panNumber3, mobileNumber3, email3, permanentaddress,
      EmployeeName, Teamleadname, DOB, DOB2, DOB3, AgreementDate, AllotmentDate, CreatedBy, status
    });
    res.status(201).json({ status: "ok", data: newCustomer });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get("/:customerId", async (req, res) => {
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
router.put("/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    const existingCustomer = await Customer.findOne({ _id: customerId });

    if (!existingCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    const {
      customerId: updatedCustomerId, title, name, fatherOrHusbandName, address, aadharNumber, panNumber, mobileNumber, email, propertyType, discount, paymentPlan, bookingDate, bookingType, sendEmail, name2, fatherOrHusbandName2, address2, aadharNumber2, panNumber2, mobileNumber2, email2, name3, fatherOrHusbandName3, address3, aadharNumber3, panNumber3, mobileNumber3, permanentaddress, Teamleadname, DOB, DOB2, DOB3, AgreementDate, AllotmentDate, email3, status
    } = req.body;
    Object.assign(existingCustomer, {
      title, name, fatherOrHusbandName, address, aadharNumber, panNumber, mobileNumber, email, propertyType, discount, paymentPlan, bookingDate, bookingType, sendEmail, name2, fatherOrHusbandName2, address2, aadharNumber2, panNumber2, mobileNumber2, email2, name3, fatherOrHusbandName3, address3, aadharNumber3, panNumber3, mobileNumber3, permanentaddress, Teamleadname, DOB, DOB2, DOB3, AgreementDate, AllotmentDate, email3, status
    });
    const updatedCustomer = await existingCustomer.save();
    res.json({ status: "ok", data: updatedCustomer });
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;