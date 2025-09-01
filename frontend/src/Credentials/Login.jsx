// Import React and the state hook
import React, { useState } from "react";


// Login component - first step (request OTP)
function Login({ onOtpRequested }) {
  // Store input values + messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send credentials to backend for OTP request
      const res = await fetch("http://localhost:5000/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Show user that OTP has been sent (mocked in console for now)
        setMessage("OTP generated. Check console (mock).");
        console.log("Mock OTP:", data.otp); // 🔑 For testing
        onOtpRequested(username);           // Pass username to OTP step
      } else {
        setMessage(data.message); // Show error
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <h2>Staff Login</h2>
      <form onSubmit={handleLogin}>
        {/* Username field */}
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {/* Password field */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Request OTP</button>
      </form>

      {/* Feedback message */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
