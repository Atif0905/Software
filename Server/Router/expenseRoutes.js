const express = require('express');
const router = express.Router();
const Expense = require('../Models/Expense'); 
router.post('/', async (req, res) => {
  try {
    const { teamLeadName, expenseSummary, amount, comment, Paydate } = req.body;
    const newExpense = new Expense({ teamLeadName, expenseSummary, amount, comment, Paydate });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense record' });
  }
});
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense records' });
  }
});
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
module.exports = router;