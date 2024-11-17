require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 3000;

// Secret key for JWT from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection successfully established");
});

// Define the schema for data
const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  course: {
    type: [String],
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

const Data = mongoose.model("Data", dataSchema);

// Define the schema for users
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user; // Attach user info to the request
    next();
  });
};

// User login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err });
  }
});

// Register new user
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

app.post("/api/logout", (req, res) => {
  res.json({ message: "Logout successful" });
});







// Get all data
app.get("/api/data", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err });
  }
});

// Get data by ID
app.get("/api/data/:id", async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data by ID", error: err });
  }
});

// Add new data
app.post("/api/data", async (req, res) => {
  const data = new Data(req.body);

  try {
    const newData = await data.save();
    res.status(201).json({ message: "Data added successfully", data: newData });
  } catch (err) {
    res.status(400).json({ message: "Adding new data failed", error: err });
  }
});

// Update data by ID
app.put("/api/data/:id", async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    Object.assign(data, req.body);

    const updatedData = await data.save();
    res.json({ message: "Data updated successfully", data: updatedData });
  } catch (err) {
    res.status(400).json({ message: "Update not possible", error: err });
  }
});

// Delete data by ID
app.delete("/api/data/:id", async (req, res) => {
  try {
    const data = await Data.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting data", error: err });
  }
});

// Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
