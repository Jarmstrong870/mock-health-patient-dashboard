// Import React and the state hook
import React, { useState } from "react";


// OTP Verification component - second step of login
function OtpVerify({ username, onLoginSuccess }) {
  const [otp, setOtp] = useState("");     // Store OTP input
  const [message, setMessage] = useState(""); // Feedback message

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      // Send username + OTP to backend
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp }),
      });

      const data = await res.json();

      if (data.success) {
        onLoginSuccess(); //  Success → move to dashboard
      } else {
        setMessage(data.message); //  Wrong OTP
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      <form onSubmit={handleVerify}>
        {/* OTP input */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit">Verify</button>
      </form>

      {/* Show message */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default OtpVerify;
