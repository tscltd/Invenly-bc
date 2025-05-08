const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  note: String,
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('borrowRequest', borrowRequestSchema);
