const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/bloodBank", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const donorSchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
});

const Donor = mongoose.model("Donor", donorSchema);

app.get("/donors", async (req, res) => {
  const donors = await Donor.find();
  res.json(donors);
});

app.post("/donors", async (req, res) => {
    console.log("Received Data:", req.body);
    try {
      const newDonor = new Donor(req.body);
      await newDonor.save();
      res.json({ message: "Donor added successfully!" });
    } catch (error) {
      console.error("Error adding donor:", error);
      res.status(500).json({ error: "Failed to add donor" });
    }
  });
  app.put("/donors/:id", async (req, res) => {
    try {
      const updatedDonor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ message: "Donor updated successfully!", donor: updatedDonor });
    } catch (error) {
      res.status(500).json({ error: "Failed to update donor" });
    }
  });
  
  // Delete a donor
  app.delete("/donors/:id", async (req, res) => {
    try {
      await Donor.findByIdAndDelete(req.params.id);
      res.json({ message: "Donor deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete donor" });
    }
  });
  
app.listen(5003, () => console.log("Server running on port 5003"));