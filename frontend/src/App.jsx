import React, { useState } from "react";
import Signup from "./Credentials/Signup";
import Login from "./Credentials/Login";
import OtpVerify from "./Credentials/OtpVerify";


// Main App component - controls navigation between pages
function App() {
  // Track which step/page we are on
  const [step, setStep] = useState("signup"); 
  const [username, setUsername] = useState("");

  // Step 1 - show signup form
  if (step === "signup") {
    return (
      <div>
        <Signup />
        <button onClick={() => setStep("login")}>
          Already have an account? Login
        </button>
      </div>
    );
  }

  // Step 2 - login form (request OTP)
  if (step === "login") {
    return (
      <Login onOtpRequested={(user) => {
        setUsername(user);
        setStep("otp"); // move to OTP step
      }} />
    );
  }

  // Step 3 - OTP entry
  if (step === "otp") {
    return (
      <OtpVerify
        username={username}
        onLoginSuccess={() => setStep("dashboard")}
      />
    );
  }

  // Step 4 - dashboard
  if (step === "dashboard") {
    return <h2> Welcome to the Patient Dashboard, {username}!</h2>;
  }

  return null;
}

export default App;
