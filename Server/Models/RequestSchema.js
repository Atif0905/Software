// models/Request.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  unit_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  block_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Block', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: null }, // This can hold 'pending', 'approved', etc.
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);
