const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
