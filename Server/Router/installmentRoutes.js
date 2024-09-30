const express = require('express');
const router = express.Router();
const Installment = require('../Models/Duedate');

// Create a new installment
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

// Get all installments
router.get('/', async (req, res) => {
  try {
    const installments = await Installment.find();
    res.json(installments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving installments', error });
  }
});

// Get installment by customerId
router.get('/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const installments = await Installment.find({ customerId });
    
    if (!installments || installments.length === 0) {
      return res.status(404).json({ message: 'No installments found for this customer.' });
    }

    res.json(installments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving installments by customerId', error });
  }
});

// Get installment by installmentId
router.get('/:installmentId', async (req, res) => {
  try {
    const { installmentId } = req.params;
    const installment = await Installment.findById(installmentId);

    if (!installment) {
      return res.status(404).json({ message: 'Installment not found.' });
    }

    res.json(installment);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving installment by ID', error });
  }
});

module.exports = router;
