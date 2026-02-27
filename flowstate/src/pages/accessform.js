import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/accessform.css";

function AccessPage({ hasAccess, onAccessGranted }) {
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (hasAccess) {
      navigate("/create", { replace: true });
    }
  }, [hasAccess, navigate]);

  const handleSubmit = async () => {
    if (!accessCode) {
      setError("Please enter a valid access code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.validation || data.Validation || "Invalid access code.");
        return;
      }

      onAccessGranted();
      navigate("/create", { replace: true });
    } catch (err) {
      setError("Validation Error");
      console.error("Error submitting access code:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="access-container">
      <div className="access-card">
        <p className="access-badge">Beta Access</p>
        <div className="header">
          <h2>Congratulations for taking on this journey to help contribute to FlowState.</h2>
          <p>
            To access FlowState Beta Testing Program, enter the access code that you received
            from your email and you're all set from there!
          </p>
        </div>

        <div className="access-divider" />

        <div className="section">
          <label htmlFor="access-code">Access Code</label>
          <input
            id="access-code"
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter your access code here"
          />
          {error && <p className="access-error">{error}</p>}
        </div>

        <button className="start-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default AccessPage;
