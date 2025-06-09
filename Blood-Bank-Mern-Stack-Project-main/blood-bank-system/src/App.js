import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({ name: "", bloodGroup: "" });
  const [editingDonor, setEditingDonor] = useState(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  // Fetch donors from backend
  const fetchDonors = async () => {
    try {
      const response = await axios.get("http://localhost:5003/donors");
      setDonors(response.data);
    } catch (error) {
      console.error("Error fetching donors:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or update donor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDonor) {
        await axios.put(`http://localhost:5003/donors/${editingDonor._id}`, formData);
        setEditingDonor(null);
      } else {
        await axios.post("http://localhost:5003/donors", formData);
      }
      fetchDonors();
      setFormData({ name: "", bloodGroup: "" });
    } catch (error) {
      console.error("Error saving donor:", error);
    }
  };

  // Handle edit
  const handleEdit = (donor) => {
    setFormData({ name: donor.name, bloodGroup: donor.bloodGroup });
    setEditingDonor(donor);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/donors/${id}`);
      fetchDonors();
    } catch (error) {
      console.error("Error deleting donor:", error);
    }
  };

  return (
    <div className="container">
      <h1>Blood Bank Management System</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Name"
          required
        />
        <input
          type="text"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          placeholder="Enter Blood Group"
          required
        />
        <button type="submit">{editingDonor ? "Update Donor" : "Add Donor"}</button>
      </form>
      <h2>Donors List</h2>
      <ul>
        {donors.map((donor) => (
          <li key={donor._id}>
            {donor.name} - {donor.bloodGroup}
            <button onClick={() => handleEdit(donor)}>Edit</button>
            <button onClick={() => handleDelete(donor._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
