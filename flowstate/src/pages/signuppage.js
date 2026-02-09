import React, { useState } from "react";
import "../styles/signuppage.css";
import logo from "../images/flowstatelogo.png";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //function for handling email check
  function EmailValidation(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      //handle the different validation here as such
      if (!name || name.trim() === "") {
        setError("Please Enter Your Name");
        return;
      }

      if (!email || email.trim() === "" || !EmailValidation(email)) {
        setError("Please Enter a valid Email");
        return;
      }

      if (!password || password.length < 8) {
        setError("Please Enter valid Password with a minimum length of 8");
        return;
      }

      if (confirmPassword !== password) {
        setError("Passwords are not matching please retype");
        return;
      }

      setLoading(true);

      const sendtobackend = await fetch(`http://localhost:5434/api/v1/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Data sent to the backend:", sendtobackend);

      const resfrombackend = await sendtobackend.json();

      if (sendtobackend.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/LoginPage");
        }, 2000);
      } else {
        setError(resfrombackend.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setError("Error connecting to the server. Please try again.");
      console.error("Error sending data to the backend", error);
    } finally {
      setLoading(false);
    }
  };

  function navigateToLanding() {
    navigate("/");
  }

  function loginPage() {
    navigate("/LoginPage");
  }

  return (
    <div className="signup-background">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <img
              src={logo}
              alt="FlowState Logo"
              className="signup-logo"
              onClick={navigateToLanding}
            />
            <h1 className="signup-title">FlowState</h1>
          </div>

          <p className="signup-subtitle">Get Started</p>
          <p className="signup-description">
            Create your account and enter your FlowState
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="signup-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{" "}
              <span className="login-link" onClick={loginPage}>
                Log In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
