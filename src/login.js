import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "./login.css"; // Ensure this file contains appropriate styles

const Login = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const navigate = useNavigate(); // React Router navigation

  // Handle form submission for Login or Signup
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Trigger login handler
      onLogin({ email, password });
      navigate("/dashboard"); // Navigate to the dashboard on successful login
    } else {
      // Trigger signup handler
      onSignup({ email, password });
      setIsLogin(true); // Switch to login after signup
    }
  };

  // Navigate to Forgot Password page
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login Form" : "Signup Form"}</h2>

      {/* Toggle Buttons for Login and Signup */}
      <div className="toggle-buttons">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>

      {/* Login/Signup Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Forgot Password Link */}
        {isLogin && (
          <div className="forgot-password">
            <button
              type="button"
              className="forgot-password-btn"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </div>
        )}

        <button type="submit" className="submit-btn">
          {isLogin ? "Login" : "Signup"}
        </button>
      </form>

      {/* Signup Prompt */}
      {isLogin && (
        <p className="signup-prompt">
          Not a member?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setIsLogin(false)}
          >
            Signup now
          </button>
        </p>
      )}
    </div>
  );
};

export default Login;
