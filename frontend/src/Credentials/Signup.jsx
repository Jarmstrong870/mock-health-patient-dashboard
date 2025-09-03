// Import React and hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // eye icons
import "./Home.css";

function Signup() {
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");        // NEW: email field
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }), // include email
      });

      const data = await res.json();

      if (data.success) {
        navigate("/login");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Staff Account Registration</h2>
        <p className="form-subtext">
          Staff accounts are required to access the patient dashboard.
        </p>

        <form onSubmit={handleSignup} className="form">
          {/* Username */}
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Email */}
          <label>Work Email</label>
          <input
            type="email"
            placeholder="Enter work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password */}
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="password-input"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Submit */}
          <button type="submit">Continue</button>
        </form>

        {/* Feedback */}
        {message && <p className="form-message">{message}</p>}

        {/* Switch to login */}
        <button className="form-switch" onClick={() => navigate("/login")}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
