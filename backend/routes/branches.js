const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Branch = require('../models/Branch');
const { protect, authorize } = require('../middleware/auth');
const validateId = require('../middleware/validateId');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// GET /api/branches - Get all branches (public)
router.get('/', async (req, res) => {
  try {
    const branches = await Branch.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, branches });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch branches' });
  }
});

// GET /api/branches/:id
router.get('/:id', validateId(), async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json({ success: true, branch });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch branch' });
  }
});

// POST /api/branches - Create branch (admin only)
router.post('/', protect, authorize('admin'), [
  body('name.ar').trim().notEmpty().withMessage('Arabic name is required'),
  body('name.en').trim().notEmpty().withMessage('English name is required'),
  body('name.ku').trim().notEmpty().withMessage('Kurdish name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required')
    .matches(/^[\d\s+()-]{7,15}$/).withMessage('Invalid phone number'),
  body('area.ar').optional().trim().isLength({ max: 200 }),
  body('area.en').optional().trim().isLength({ max: 200 }),
  body('area.ku').optional().trim().isLength({ max: 200 }),
  body('workingHours.open').optional().matches(/^\d{2}:\d{2}$/),
  body('workingHours.close').optional().matches(/^\d{2}:\d{2}$/),
  body('isOpen').optional().isBoolean(),
  validate,
], async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, branch });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create branch' });
  }
});

// PUT /api/branches/:id - Update branch (admin/manager)
router.put('/:id', protect, authorize('admin', 'manager'), validateId(), [
  body('name.ar').optional().trim().notEmpty(),
  body('name.en').optional().trim().notEmpty(),
  body('name.ku').optional().trim().notEmpty(),
  body('phone').optional().trim().matches(/^[\d\s+()-]{7,15}$/),
  body('isOpen').optional().isBoolean(),
  validate,
], async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json({ success: true, branch });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update branch' });
  }
});

// DELETE /api/branches/:id (admin only)
router.delete('/:id', protect, authorize('admin'), validateId(), async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json({ success: true, message: 'Branch deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete branch' });
  }
});

module.exports = router;
