const express = require('express');
const Request = require('../Models/RequestSchema');

const router = express.Router();

// POST endpoint to create a request
router.post('/', async (req, res) => {
  const { unit_id, block_id, project_id, user_id } = req.body;
  try {
    const newRequest = new Request({
      unit_id,
      block_id,
      project_id,
      user_id,
    });
    await newRequest.save();
    res.status(201).json({ message: 'Request created successfully', data: newRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating request' });
  }
});

// PUT endpoint to update the request
router.put('/:id', async (req, res) => {
  const { status, user_id } = req.body;
  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status, user_id, updated_at: new Date() },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.status(200).json({ message: 'Request updated successfully', data: updatedRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating request' });
  }
});

// GET endpoint to fetch requests
router.get('/', async (req, res) => {
  const { user_id, project_id, status } = req.query;

  const filter = {};
  if (user_id) filter.user_id = user_id;
  if (project_id) filter.project_id = project_id;
  if (status) filter.status = status;

  try {
    const requests = await Request.find(filter).sort({ created_at: -1 }); // Sort by creation date (most recent first)
    res.status(200).json({ message: 'Requests fetched successfully', data: requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

module.exports = router;
