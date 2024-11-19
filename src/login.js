import React, { useState } from "react";
import "./login.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Toggle between Login and Signup

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      if (isSignup) {
        alert("Signup successful!");
        setIsSignup(false); // Switch back to login after signup
      } else {
        // Simulate login success
        onLogin({ username: email });
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isSignup ? "Signup Form" : "Login Form"}</h2>

        <div className="toggle-buttons">
          <button
            type="button"
            className={isSignup ? "" : "active"}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>
          <button
            type="button"
            className={isSignup ? "active" : ""}
            onClick={() => setIsSignup(true)}
          >
            Signup
          </button>
        </div>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isSignup && (
          <input
            type="password"
            placeholder="Confirm Password"
            required
          />
        )}
        <button type="submit">{isSignup ? "Signup" : "Login"}</button>
      </form>
    </div>
  );
};

export default Login;
