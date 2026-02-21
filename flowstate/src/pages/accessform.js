import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/accessform.css";

function AccessPage() {
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5434/api/v1/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit access code");
      }
    } catch (error) {
      console.error("Error submitting access code:", error);
    }
  };

  return (
    <div className="access-container">
      <div className="access-card">
        <div className="header">
          <h2>Congratulations for taking on this journey to help contribute to FlowState.</h2>
          <p>To access FlowState Beta Testing Program, enter the access code that you received from your email and you're all set from there!</p>
        </div>

        <div className="section">
          <label htmlFor="access-code">Access Code</label>
          <input
            id="access-code"
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter your access code here"
          />
        </div>

        <button className="start-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default AccessPage;
