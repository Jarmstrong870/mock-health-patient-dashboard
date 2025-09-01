// Import core dependencies
const express = require("express");   // Web framework for building APIs
const cors = require("cors");         // Middleware to allow cross-origin requests (frontend → backend)
const bcrypt = require("bcrypt");     // Library for securely hashing passwords

// Import database helpers from ./database/database.js
const { addUser, findUserByUsername } = require("./database/database");

// Initialize express app
const app = express();
const PORT = 5000; // Port for backend server

// Middleware setup
app.use(cors());            // Allow frontend requests (React running on another port)
app.use(express.json());    // Parse incoming JSON bodies in requests

// OTP store (still in memory for now)
const otpStore = {};        // Stores OTPs temporarily in the format: { username: { otp, expires } }

/* 
  SIGNUP ROUTE
  Registers a new staff user with a username + hashed password.
*/
app.post("/signup", async (req, res) => {
  const { username, password } = req.body; // Extract credentials from request

  try {
    // Check if username already exists in DB
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before storing (NEVER store plain text passwords)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to SQLite database
    addUser(username, hashedPassword);

    // Respond back with success
    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* 
  REQUEST OTP ROUTE (Login Step 1)
  User submits username + password. 
  If valid, generate a one-time password (OTP) valid for 2 minutes.
*/
app.post("/request-otp", async (req, res) => {
  const { username, password } = req.body; // Extract login credentials

  try {
    // Look up user in DB
    const user = findUserByUsername(username);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare entered password with stored hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and expiry time in otpStore
    otpStore[username] = {
      otp,
      expires: Date.now() + 2 * 60 * 1000, // valid for 2 minutes
    };

    // For now, return OTP in response (later we could email/SMS it)
    res.json({ success: true, otp, message: "OTP generated (mock)" });
  } catch (err) {
    console.error("OTP request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* 
  VERIFY OTP ROUTE (Login Step 2)
  User submits username + OTP. 
  If OTP matches and is not expired → login success.
*/
app.post("/verify-otp", (req, res) => {
  const { username, otp } = req.body; // Extract username + entered OTP

  // Check if OTP was generated for this user
  const record = otpStore[username];
  if (!record) return res.status(400).json({ message: "No OTP requested" });

  // Check if OTP expired
  if (Date.now() > record.expires) {
    return res.status(401).json({ message: "OTP expired" });
  }

  // Check if OTP matches stored value
  if (record.otp !== otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  // OTP is valid → remove it from store (one-time use)
  delete otpStore[username];

  // Respond with success
  res.json({ success: true, message: "Login successful" });
});

/* 
  START SERVER
  Launch backend API on defined port.
*/
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
