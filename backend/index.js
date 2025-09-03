const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const { addUser, findUserByUsername } = require("./database/database");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Setup Gmail transporter with your App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jaa07102002@gmail.com",       // your Gmail address
    pass: "iszjqccxmcxrbjvf",          // your generated App Password
  },
});

// OTP storage (in memory for now)
const otpStore = {};

// SIGNUP route
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    addUser(username, email, hashedPassword);

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// REQUEST OTP route
app.post("/request-otp", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = findUserByUsername(username);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[username] = {
      otp,
      expires: Date.now() + 2 * 60 * 1000,
    };

    // ✅ Email the OTP to the staff's saved email
    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: user.email, // staff’s email stored in DB
      subject: "Your OTP Code",
      text: `Your one-time password (OTP) is: ${otp}. It expires in 2 minutes.`,
    });

    res.json({ success: true, message: "OTP sent to registered email." });
  } catch (err) {
    console.error("OTP request error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// VERIFY OTP route
app.post("/verify-otp", (req, res) => {
  const { username, otp } = req.body;

  const record = otpStore[username];
  if (!record) return res.status(400).json({ message: "No OTP requested" });

  if (Date.now() > record.expires) {
    return res.status(401).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(401).json({ message: "Invalid OTP" });
  }

  delete otpStore[username];
  res.json({ success: true, message: "Login successful" });
});

app.listen(PORT, () =>
  console.log(`Backend running at http://localhost:${PORT}`)
);
