const express = require('express');
const router = express.Router();
const PaymentPlan = require('../Models/PaymentPlan');
router.post('/', async (req, res) => {
  try {
    const { type, planName, numInstallments, installments } = req.body;
    if (!type || !planName || !numInstallments || !installments) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const paymentPlan = new PaymentPlan({
      type,
      planName,
      numInstallments,
      installments,
    });
    await paymentPlan.save();
    res.status(201).json({ message: 'Payment plan created successfully', paymentPlan });
  } catch (error) {
    console.error('Error creating payment plan:', error);
    res.status(500).json({ error: 'An error occurred while creating the payment plan' });
  }
});

// Get all payment plans
router.get('/', async (req, res) => {
  try {
    const paymentPlans = await PaymentPlan.find();
    res.status(200).json({ paymentPlans });
  } catch (error) {
    console.error('Error fetching payment plans:', error);
    res.status(500).json({ error: 'An error occurred while fetching payment plans' });
  }
});

module.exports = router;
