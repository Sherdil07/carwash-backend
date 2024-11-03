const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add or update a service
router.post("/", async (req, res) => {
  const { carType, serviceName, price } = req.body;

  try {
    const service = await Service.findOneAndUpdate(
      { carType, serviceName },
      { price },
      { new: true, upsert: true }
    );
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a service
router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
