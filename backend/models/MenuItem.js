const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true },
    ku: { type: String, required: true },
  },
  description: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    ku: { type: String, default: '' },
  },
  category: { type: String, enum: ['crispy', 'family', 'sides'], required: true },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  icon: { type: String, default: '🍗' },
  image: { type: String, default: '' },
  badge: { type: String, enum: ['popular', 'new', 'spicy', null], default: null },
  isAvailable: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

MenuItemSchema.index({ category: 1, sortOrder: 1 });
MenuItemSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
