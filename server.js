const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Create an instance of Express
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(
  cors({
    origin: "https://carwash-frontend-eight.vercel.app", // Allow requests from the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  })
);
app.use(express.json()); // Parse JSON request bodies

// Logging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

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
    console.error("Error fetching invoices:", err); // Log the error
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
    console.error("Error creating invoice:", err); // Log the error
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
    console.error("Error updating invoice:", err); // Log the error
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
    console.error("Error deleting invoice:", err); // Log the error
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
