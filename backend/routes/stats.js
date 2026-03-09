const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

// GET /api/stats/dashboard - Dashboard stats (admin/manager)
router.get('/dashboard', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { branch } = req.query;
    const filter = {};
    if (branch) filter.branch = branch;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayOrders, totalOrders, pendingOrders, totalRevenue] = await Promise.all([
      Order.countDocuments({ ...filter, createdAt: { $gte: today, $lt: tomorrow } }),
      Order.countDocuments(filter),
      Order.countDocuments({ ...filter, status: { $in: ['pending', 'confirmed', 'preparing'] } }),
      Order.aggregate([
        { $match: { ...filter, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const todayRevenue = await Order.aggregate([
      { $match: { ...filter, status: 'delivered', createdAt: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.json({
      success: true,
      stats: {
        todayOrders,
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayRevenue: todayRevenue[0]?.total || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/stats/orders-by-status
router.get('/orders-by-status', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'staff' ? { branch: req.user.branch } : {};
    const stats = await Order.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order stats' });
  }
});

// GET /api/stats/weekly - Last 7 days revenue (admin/manager)
router.get('/weekly', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      days.push({ start: new Date(d), end: next, label: d.toISOString().slice(0, 10) });
    }

    const results = await Promise.all(days.map(async (day) => {
      const [revenue, orders] = await Promise.all([
        Order.aggregate([
          { $match: { status: 'delivered', createdAt: { $gte: day.start, $lt: day.end } } },
          { $group: { _id: null, total: { $sum: '$total' } } }
        ]),
        Order.countDocuments({ createdAt: { $gte: day.start, $lt: day.end } })
      ]);
      return { date: day.label, revenue: revenue[0]?.total || 0, orders };
    }));

    res.json({ success: true, weekly: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weekly stats' });
  }
});

// GET /api/stats/top-items - Top selling items (admin/manager)
router.get('/top-items', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.name', totalQty: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.subtotal' } } },
      { $sort: { totalQty: -1 } },
      { $limit: 10 }
    ]);
    res.json({ success: true, topItems });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top items' });
  }
});

module.exports = router;
