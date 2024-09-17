const express = require('express');
const router = express.Router();
const Installment = require('../Models/Duedate'); 

router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const installments = await Installment.find();
    res.json(installments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving installments', error });
  }
});

module.exports = router;
