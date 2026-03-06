const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true },
    ku: { type: String, required: true },
  },
  area: {
    ar: { type: String, default: '' },
    en: { type: String, default: '' },
    ku: { type: String, default: '' },
  },
  phone: { type: String, required: true },
  address: { type: String, default: '' },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  isOpen: { type: Boolean, default: true },
  workingHours: {
    open: { type: String, default: '10:00' },
    close: { type: String, default: '00:00' },
  },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
