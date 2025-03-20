const express = require('express');
const router = express.Router();
const ReturnPayment = require('../Models/Returnpayment'); 
router.post('/', async (req, res) => {
    const { customername, customeremail, projectname,blockname,unitname,  paymentMode, amount, reference, comment, PaymentDate } = req.body;
    try {
      if (!customeremail || !reference || !projectname) {
        return res.status(400).json({ error: 'PaymentType, Reference, and CustomerId are required fields' });
      }
      const payment = await ReturnPayment.create({
        customername,
        customeremail,
        projectname,
        blockname,
        unitname,
        paymentMode,
        amount,
        reference,
        comment,
        PaymentDate,
      });
      res.status(201).json({ status: 'ok', message: 'Payment details added successfully', data: payment });
    } catch (error) {
      console.error('Error adding payment details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get all payment details
  router.get('/', async (req, res) => {
    try {
      const payments = await ReturnPayment.find();
      res.status(200).json({ status: 'ok', data: payments });
    } catch (error) {
      console.error('Error fetching payment details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;