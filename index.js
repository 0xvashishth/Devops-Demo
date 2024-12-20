// server.js

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 3000;

// MongoDB connection
const dbURI = process.env.MONGO_URI; // Replace with your MongoDB connection string
mongoose.connect(dbURI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// MongoDB User Schema and Model
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Endpoints
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

app.get("/addUser", async (req, res) => {
    const { name, email } = req.query;

    if (!name || !email) {
        return res.status(400).send("Name and email are required");
    }

    try {
        const newUser = new User({ name, email });
        await newUser.save();
        res.status(201).send("User added successfully");
    } catch (err) {
        res.status(500).send("Error adding user");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;