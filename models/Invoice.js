const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    carNumber: String,
    carType: String,
    services: [String],
    total: Number,
    date: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
