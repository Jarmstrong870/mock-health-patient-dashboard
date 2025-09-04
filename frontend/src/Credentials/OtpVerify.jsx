// Import React and hooks
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Home.css"; // reuse form styles

function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Grab username passed from Login.jsx
  const { username } = location.state || {};

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp }),
      });

      const data = await res.json();

      if (data.success) {
        // ✅ OTP correct → navigate to dashboard
        navigate("/dashboard");
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
        <h2>OTP Verification</h2>
        <p className="form-subtext">
          Enter the one-time password sent to your registered email.
        </p>

        <form onSubmit={handleVerify} className="form">
          <label>One-Time Password</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit">Verify OTP</button>
        </form>

        {message && <p className="form-message">{message}</p>}

        <button className="form-switch" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default OtpVerify;
