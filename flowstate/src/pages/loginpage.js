import React, { useState, useEffect } from "react";
import "../styles/loginpage.css";
import logo from "../images/flowstatelogo.png";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle Google OAuth callback - token comes back as a query param
  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (token) {
      localStorage.setItem("authToken", token);
      setSuccess("Google Login Successful! Entering your FlowState...");
      setTimeout(() => navigate("/interview"), 1500);
    }

    if (oauthError) {
      setError("Google sign-in failed. Please try again.");
    }
  }, [searchParams, navigate]);

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

          <p className="login-subtitle">Welcome Back</p>
          <p className="login-description">Log in to enter your FlowState</p>

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

          <div className="google-divider">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>

          <button
            className="google-btn"
            onClick={() => {
              const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
              const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
              const scope = "openid email profile";
              const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
              window.location.href = googleAuthUrl;
            }}
          >
            <svg
              className="google-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign In With Google
          </button>

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
