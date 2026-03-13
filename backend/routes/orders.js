const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Order = require('../models/Order');
const rateLimit = require('express-rate-limit');
const { protect, authorize } = require('../middleware/auth');
const validateId = require('../middleware/validateId');

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many tracking requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// POST /api/orders - Create new order (public)
router.post('/', [
  body('customer.name').trim().notEmpty().withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('customer.phone').trim().notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s+()-]{7,15}$/).withMessage('Invalid phone number'),
  body('customer.address').optional().trim().isLength({ max: 300 }).withMessage('Address too long'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItem').notEmpty().withMessage('Invalid menu item'),
  body('items.*.name').trim().notEmpty().withMessage('Item name required'),
  body('items.*.quantity').isInt({ min: 1, max: 50 }).withMessage('Invalid quantity'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Invalid price'),
  body('items.*.subtotal').isFloat({ min: 0 }).withMessage('Invalid subtotal'),
  body('total').isFloat({ min: 0 }).withMessage('Invalid total'),
  body('orderType').isIn(['delivery', 'pickup']).withMessage('Invalid order type'),
  body('paymentMethod').optional().isIn(['cash']).withMessage('Invalid payment method'),
  body('branch').notEmpty().withMessage('Branch is required'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes too long'),
  validate,
], async (req, res) => {
  try {
    const { customer, items, total, orderType, paymentMethod, branch, notes } = req.body;
    const order = await Order.create({ customer, items, total, orderType, paymentMethod: paymentMethod || 'cash', branch, notes: notes || '' });
    await order.populate('branch', 'name phone');
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders - Get all orders (staff+)
router.get('/', protect, async (req, res) => {
  try {
    const { status, branch, date, page = 1, limit = 50 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const filter = {};
    if (status && ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'].includes(status)) {
      filter.status = status;
    }
    if (req.user.role === 'staff') filter.branch = req.user.branch;
    else if (branch) filter.branch = branch;
    if (date) {
      const start = new Date(date);
      if (!isNaN(start.getTime())) {
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
        filter.createdAt = { $gte: start, $lt: end };
      }
    }
    const orders = await Order.find(filter)
      .populate('branch', 'name')
      .populate('statusHistory.updatedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);
    const total = await Order.countDocuments(filter);
    res.json({ success: true, orders, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/:id', protect, validateId(), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('branch items.menuItem');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role === 'staff' && order.branch?.toString() !== req.user.branch?.toString()) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', protect, validateId(), [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  validate,
], async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    order.statusHistory.push({ status, updatedBy: req.user._id });
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

// GET /api/orders/track/:orderNumber - Track order by number (public)
router.get('/track/:orderNumber', trackLimiter, async (req, res) => {
  try {
    const orderNumber = parseInt(req.params.orderNumber);
    if (isNaN(orderNumber) || orderNumber < 0) {
      return res.status(400).json({ error: 'Invalid order number' });
    }
    const order = await Order.findOne({ orderNumber })
      .select('orderNumber status customer.name items total createdAt estimatedDelivery statusHistory');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track order' });
  }
});

module.exports = router;
