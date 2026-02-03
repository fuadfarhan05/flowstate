import React, { useState } from "react";
import "../styles/loginpage.css";
import logo from "../images/flowstatelogo.png";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function EmailRegexValidation(email) {
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
      if (!email || email.trim() === "" || !EmailRegexValidation(email)) {
        setError("Please enter a valid Email");
        return;
      }

      if (!password || password.length < 8) {
        alert("Enter a valid password");
        return;
      }

      setLoading(true);

      const sendToBackend = await fetch(`http://localhost:5434/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Data sent to the backend:", sendToBackend);

      const resFromBackend = await sendToBackend.json();

      if (sendToBackend.ok) {
        setSuccess("Login Successful! Entering your Flow...");

        // handle token in local storage
        if (resFromBackend.token) {
          localStorage.setItem("authToken", resFromBackend.token);
        }

        // redirect to a certain page ask fuad which page for now redirect to the analysis page
        setTimeout(() => navigate("/interview"), 1500); // navigates to the interview page once successful 
        
      } else {
        setError(resFromBackend.error || "Login failed. Please try again");
      }
    } catch (error) {
      setError("Error connecting to the server. Please try again.");
      alert("Error");
      console.error("Error sending data to the backend", error);
    } finally {
      setLoading(false);
    }
  };

  // this navigates back to the landing page.
  function navigateToLanding() {
    navigate("/");
  }

  function signUpPage() {
    navigate("/signuppage");
  }

  return (
    <div className="login-background">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img
              src={logo}
              alt="FlowState Logo"
              className="login-logo"
              onClick={navigateToLanding}
            />
            <h1 className="login-title">FlowState</h1>
          </div>

          <p className="login-subtitle">Welcome back</p>
          <p className="login-description">Log in to continue your Flow</p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="login-form">
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
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Log In
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <span className="signup-link" onClick={signUpPage}>
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
