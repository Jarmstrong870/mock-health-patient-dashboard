import React, { useState } from "react";
import "./Signup.css"; // NHS-style CSS

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* NHS-style heading */}
        <h2>Staff Account Registration</h2>
        <p className="signup-subtext">
          Staff accounts are required to access the patient dashboard.
        </p>

        {/* Signup form */}
        <form onSubmit={handleSignup} className="signup-form">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* NHS green button */}
          <button type="submit">Continue</button>
        </form>

        {/* Feedback message */}
        {message && <p className="signup-message">{message}</p>}

        {/* Switch to login */}
        <button className="signup-switch">
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
