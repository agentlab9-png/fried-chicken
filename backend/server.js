require('dotenv').config();

// ─── Environment Validation ──────────────────────────────────────────────────
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

if (process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
  console.warn('WARNING: Using default JWT_SECRET. Change this in production!');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const branchRoutes = require('./routes/branches');
const statsRoutes = require('./routes/stats');

const app = express();

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many orders, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ─── Database ────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ─── Cache Headers Middleware ────────────────────────────────────────────────
app.use('/api/menu', (req, res, next) => {
  if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=300');
  next();
});

app.use('/api/branches', (req, res, next) => {
  if (req.method === 'GET') res.set('Cache-Control', 'public, max-age=300');
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderLimiter, orderRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', app: 'Fried Chicken API', version: '1.0.0' });
});

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  if (statusCode === 500) console.error('Server Error:', err);
  res.status(statusCode).json({ error: message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Fried Chicken API running on port ' + PORT));
module.exports = app;
