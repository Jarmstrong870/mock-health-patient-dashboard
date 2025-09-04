// Import React and hooks
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// ✅ Import shared Home.css
import "./Home.css";

function Login({ onOtpRequested }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("OTP generated. Please check your email.");
        console.log("Mock OTP:", data.otp);

        //  Navigate to OTP verification page with username
        navigate("/otp", { state: { username } });


        if (onOtpRequested) {
          onOtpRequested(username);
        }
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
        <h2>Staff Login</h2>
        <p className="form-subtext">
          Enter your credentials to request a one-time password (OTP).
        </p>

        <form onSubmit={handleLogin} className="form">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button type="submit">Request OTP</button>
        </form>

        {message && <p className="form-message">{message}</p>}

        <button className="form-switch" onClick={() => navigate("/signup")}>
          Don’t have an account? Sign up
        </button>
      </div>
    </div>
  );
}

export default Login;
