const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MenuItem = require('../models/MenuItem');
const { protect, authorize } = require('../middleware/auth');
const validateId = require('../middleware/validateId');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// GET /api/menu - Get all menu items (public)
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    const filter = {};
    if (category && ['crispy', 'family', 'sides'].includes(category)) {
      filter.category = category;
    }
    if (available !== undefined) filter.isAvailable = available === 'true';
    const items = await MenuItem.find(filter).sort({ sortOrder: 1, category: 1 });
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// GET /api/menu/:id - Get single item
router.get('/:id', validateId(), async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// POST /api/menu - Create item (admin/manager)
router.post('/', protect, authorize('admin', 'manager'), [
  body('name.ar').trim().notEmpty().withMessage('Arabic name is required'),
  body('name.en').trim().notEmpty().withMessage('English name is required'),
  body('name.ku').trim().notEmpty().withMessage('Kurdish name is required'),
  body('category').isIn(['crispy', 'family', 'sides']).withMessage('Invalid category'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description.ar').optional().trim().isLength({ max: 500 }),
  body('description.en').optional().trim().isLength({ max: 500 }),
  body('description.ku').optional().trim().isLength({ max: 500 }),
  body('badge').optional().isIn(['popular', 'new', 'spicy', null]).withMessage('Invalid badge'),
  body('isAvailable').optional().isBoolean(),
  validate,
], async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, item });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create menu item' });
  }
});

// PUT /api/menu/:id - Update item (admin/manager)
router.put('/:id', protect, authorize('admin', 'manager'), validateId(), [
  body('name.ar').optional().trim().notEmpty(),
  body('name.en').optional().trim().notEmpty(),
  body('name.ku').optional().trim().notEmpty(),
  body('category').optional().isIn(['crispy', 'family', 'sides']),
  body('price').optional().isFloat({ min: 0 }),
  body('badge').optional().isIn(['popular', 'new', 'spicy', null]),
  body('isAvailable').optional().isBoolean(),
  validate,
], async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ success: true, item });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update menu item' });
  }
});

// DELETE /api/menu/:id - Delete item (admin only)
router.delete('/:id', protect, authorize('admin'), validateId(), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

module.exports = router;
