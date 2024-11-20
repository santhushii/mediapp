import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();

    // Call the backend API to send the reset password email
    fetch("http://localhost:3001/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("An error occurred. Please try again.");
      });
  };

  return (
    <div className="login-container">
      <h2>Forgot Password?</h2>
      <p>No worries, we’ll send you reset instructions.</p>
      <form onSubmit={handleForgotPassword}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Reset Password
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <button
        type="button"
        className="link-btn"
        onClick={() => navigate("/")}
      >
        Back to login
      </button>
    </div>
  );
};

export default ForgotPassword;
