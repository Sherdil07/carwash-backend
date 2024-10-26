const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI) // Use environment variable for Atlas URI
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Invoice model
const Invoice = mongoose.model(
  "Invoice",
  new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    carNumber: { type: String, required: true },
    carType: { type: String, required: true },
    services: { type: [String], required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  })
);

// API endpoint to get all invoices
app.get("/api/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// API endpoint to add a new invoice
app.post("/api/invoices", async (req, res) => {
  const { name, email, phone, carNumber, carType, services, total } = req.body;
  const invoice = new Invoice({
    name,
    email,
    phone,
    carNumber,
    carType,
    services,
    total,
  });

  try {
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

// API endpoint to update an invoice
app.put("/api/invoices/:id", async (req, res) => {
  const { name, email, phone, carNumber, carType, services, total } = req.body;
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, carNumber, carType, services, total },
      { new: true } // Return the updated document
    );
    if (!updatedInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(updatedInvoice);
  } catch (err) {
    res.status(500).json({ error: "Failed to update invoice" });
  }
});

// API endpoint to delete an invoice
app.delete("/api/invoices/:id", async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
