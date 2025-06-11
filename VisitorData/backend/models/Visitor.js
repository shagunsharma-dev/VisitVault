const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  reason: { type: String, required: true },
  photo: { type: String },      // base64 string (optional)
  signature: { type: String }   // base64 string (optional)
});

module.exports = mongoose.model('Visitor', visitorSchema);
