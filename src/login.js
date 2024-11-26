import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ onLogin, onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (isLogin) {
      onLogin({ email, password });
      navigate("/dashboard");
    } else {
      onSignup({ email, password });
      navigate("/dashboard");
    }
  };

  // Navigate to Forgot Password page
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? "Login Form" : "Signup Form"}</h2>

      {/* Toggle Buttons */}
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

      {/* Form */}
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

        {/* Forgot Password */}
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
