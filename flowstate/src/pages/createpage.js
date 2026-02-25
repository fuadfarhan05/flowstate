import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSheetPlastic } from "react-icons/fa6";

import "../styles/createpage.css";

function CreatePage() {
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [questionsPerExperience, setQuestionsPerExperience] = useState(2);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const fileInputRef = useRef(null);

  function handleUpload(event) {
    const file = event.target.files[0];
    setUpload(file);
  }

  function triggerUpload() {
    fileInputRef.current.click();
  }

  const handleSubmit = async () => {
    if (!upload || isCreatingSession) return;

    const formData = new FormData();
    formData.append("upload", upload);
    setIsCreatingSession(true);

    try {
      // 1️⃣ Parse resume
      const response = await fetch("http://localhost:8000/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const normalizedExperiences = Object.keys(data.experiences);

      // 2️⃣ Generate interview questions
      const genResponse = await fetch(
        "http://localhost:5434/api/v1/generate-experiencequestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            experiences: normalizedExperiences,
            questionsPerExperience,
          }),
        }
      );

      const genData = await genResponse.json();

      navigate("/interview", {
        state: {
          questions: genData.questions,
          maxFollowUps: questionsPerExperience,
        },

      });
    } catch (error) {
      setIsCreatingSession(false);
      console.error("Failed to create interview session:", error);
    }
  };

  return (
    <div className="create-container">

      <div className="main-card">
        <div className="header">
          <h3>Create Interview Session</h3>
        </div>

        {/* Upload Section */}
        <div className="section">
          <label>Upload your resume</label>

          <div className="upload-box">
            <button
              style={{
                color: "white",
                background: "none",
                border: "none",
                fontSize: "80px",
                cursor: "pointer",
              }}
              onClick={triggerUpload}
            >
              <FaSheetPlastic />
              <p>click here to upload</p>
            </button>

            {upload && (
              <p className="upload-name">🔗 {upload.name}</p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Questions Per Experience */}
        <div className="section">
          <label style={{marginTop: '100px'}}>FlowState asks your question about your work experience, how many FOLLOW UP questions do you want to be asked about each experience on your resume?</label>

          <select
            value={questionsPerExperience}
            onChange={(e) =>
              setQuestionsPerExperience(Number(e.target.value))
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              fontSize: "16px",
              marginTop: "10px",
            }}
          >
            <option value={1}>1 question(easy)</option>
            <option value={2}>2 questions(Normal)</option>
            <option value={3}>3 questions(Advanced)</option>
          </select>
        </div>

        {/* Start Button */}
        <button
          className="start-btn"
          onClick={handleSubmit}
          disabled={!upload || isCreatingSession}
          style={{
            opacity: upload && !isCreatingSession ? 1 : 0.6,
            cursor: upload && !isCreatingSession ? "pointer" : "not-allowed",
          }}
        >
          {isCreatingSession ? "Creating Session..." : "Start Session"}
        </button>
      </div>

      {isCreatingSession && (
        <div className="create-loading-overlay">
          <div className="create-loading-spinner" />
          <h2>Creating your interview session...</h2>
          <p>Parsing your resume and generating your questions.</p>
        </div>
      )}
    </div>
  );
}

export default CreatePage;
