const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const { protect, authorize } = require('../middleware/auth');

// GET /api/branches - Get all branches (public)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, branches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/branches/:id
router.get('/:id', async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json({ success: true, branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/branches - Create branch (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, branch });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/branches/:id - Update branch (admin/manager)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json({ success: true, branch });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/branches/:id (admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Branch deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
