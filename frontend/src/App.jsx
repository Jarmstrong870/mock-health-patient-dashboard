// Import React core
import React, { useState } from "react";

// Import React Router components
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// Import pages/components
import Signup from "./Credentials/Signup";
import Login from "./Credentials/Login";
import OtpVerify from "./Credentials/OtpVerify";

// Wrapper component for OTP to use navigate properly
function OtpWrapper({ username }) {
  const navigate = useNavigate();
  return (
    <OtpVerify
      username={username}
      onLoginSuccess={() => navigate("/dashboard")} // redirect with router
    />
  );
}

// Main App component
function App() {
  // Store logged-in user state
  const [username, setUsername] = useState("");

  return (
    <Router>
      <Routes>
        {/* Default route → redirect to login page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Signup page */}
        <Route
          path="/signup"
          element={
            <Signup
              // After signup, redirect back to login
              onSignupSuccess={() => <Navigate to="/login" />}
            />
          }
        />

        {/* Login page */}
        <Route
          path="/login"
          element={
            <Login
              onOtpRequested={(user) => {
                setUsername(user); // store username in state
                return <Navigate to="/otp" />; // navigate to OTP
              }}
              onSwitchToSignup={() => <Navigate to="/signup" />} // allow switching to signup
            />
          }
        />

        {/* OTP verify page */}
        <Route path="/otp" element={<OtpWrapper username={username} />} />

        {/* Dashboard page */}
        <Route
          path="/dashboard"
          element={<h2>Welcome to the Patient Dashboard, {username}!</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;
