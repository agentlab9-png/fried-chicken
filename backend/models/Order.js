const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: Number, unique: true },
  customer: {
    name: { type: String, required: [true, 'Customer name is required'] },
    phone: { type: String, required: [true, 'Phone number is required'] },
    address: { type: String, default: '' },
  },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderType: { type: String, enum: ['delivery', 'pickup'], required: true },
  paymentMethod: { type: String, enum: ['cash'], default: 'cash' },
  branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  notes: { type: String, default: '' },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
  estimatedDelivery: { type: Date },
}, { timestamps: true });

OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const lastOrder = await this.constructor.findOne({}, {}, { sort: { orderNumber: -1 } });
      this.orderNumber = lastOrder ? lastOrder.orderNumber + 1 : 1000;
      const existing = await this.constructor.findOne({ orderNumber: this.orderNumber });
      if (!existing) break;
    }
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
