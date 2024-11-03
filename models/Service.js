const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  carType: { type: String, required: true },
  serviceName: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Service", serviceSchema);
