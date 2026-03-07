const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// POST /api/auth/login
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Invalid username'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 128 }).withMessage('Invalid password'),
  validate,
], async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    const token = user.generateToken();
    res.json({
      success: true,
      token,
      user: { id: user._id, username: user.username, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/register (admin only)
router.post('/register', protect, authorize('admin'), [
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters')
    .isAlphanumeric().withMessage('Username must be alphanumeric'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  body('role').optional().isIn(['admin', 'manager', 'staff']).withMessage('Invalid role'),
  validate,
], async (req, res) => {
  try {
    const { username, password, name, role, branch } = req.body;
    const user = await User.create({ username, password, name, role, branch });
    res.status(201).json({ success: true, user: { id: user._id, username: user.username, name: user.name, role: user.role } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// GET /api/auth/users (admin/manager only)
router.get('/users', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const users = await User.find().populate('branch', 'name').select('-__v');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/auth/users/:id (admin only)
router.put('/users/:id', protect, authorize('admin'), [
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Name too long'),
  body('role').optional().isIn(['admin', 'manager', 'staff']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('Invalid active status'),
  validate,
], async (req, res) => {
  try {
    const allowedFields = ['name', 'role', 'branch', 'isActive'];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-__v');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
