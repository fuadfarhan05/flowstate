import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/accessform.css";

function AccessPage() {
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = () => {
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
