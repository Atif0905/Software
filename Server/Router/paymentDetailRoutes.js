const express = require('express');
const router = express.Router();
const Payment = require('../Models/PaymentRecive'); // Ensure this path points to your Payment model

// Create a new payment detail
router.post('/', async (req, res) => {
  const { customerId, paymentType, paymentMode, amount, reference, comment, aadharNumber, PaymentDate } = req.body;
  try {
    if (!paymentType || !reference || !customerId) {
      return res.status(400).json({ error: 'PaymentType, Reference, and CustomerId are required fields' });
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
    res.status(201).json({ status: 'ok', message: 'Payment details added successfully', data: payment });
  } catch (error) {
    console.error('Error adding payment details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all payment details
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ status: 'ok', data: payments });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get payment details by customerId
router.get('/:customerId', async (req, res) => {
  const { customerId } = req.params;
  try {
    const payments = await Payment.find({ customerId });
    if (payments.length === 0) {
      return res.status(404).json({ error: 'No payments found for the specified customerId' });
    }
    res.status(200).json({ status: 'ok', data: payments });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a payment detail
router.put('/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  const { customerId, paymentMode, amount, reference, comment, PaymentDate } = req.body;
  try {
    if (!reference || !customerId) {
      return res.status(400).json({ error: 'Reference and CustomerId are required fields' });
    }
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { customerId, paymentMode, amount, reference, comment, PaymentDate },
      { new: true }
    );
    if (!updatedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ status: 'ok', message: 'Payment details updated successfully', data: updatedPayment });
  } catch (error) {
    console.error('Error updating payment details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a payment detail
router.delete('/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  try {
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);
    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json({ status: 'ok', message: 'Payment details deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
