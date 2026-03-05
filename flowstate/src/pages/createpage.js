import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSheetPlastic } from "react-icons/fa6";

import "../styles/createpage.css";

function CreatePage() {
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [questionsPerExperience, setQuestionsPerExperience] = useState(2);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [pendingSessionData, setPendingSessionData] = useState(null);

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
      const response = await fetch(`${process.env.REACT_APP_PYTHON_URL}/parse-resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const normalizedExperiences = Object.keys(data.experiences);

      // 2️⃣ Generate interview questions
      const genResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/generate-experiencequestions`,
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

      setPendingSessionData({
        questions: genData.questions,
        maxFollowUps: questionsPerExperience,
      });
      setIsCreatingSession(false);
      setShowPrepModal(true);
    } catch (error) {
      setIsCreatingSession(false);
      console.error("Failed to create interview session:", error);
    }
  };

  const handlePrepConfirm = () => {
    if (!pendingSessionData) return;

    navigate("/interview", {
      state: pendingSessionData,
    });
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

      {showPrepModal && (
        <div className="prep-modal-overlay">
          <div className="prep-modal-card">
            <div className="prep-row">
              <div className="prep-icon prep-icon-white" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>
                Have your microphone on. FlowState will not be able to hear your responses otherwise.
              </p>
            </div>

            <div className="prep-row">
              <div className="prep-icon prep-icon-gold" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>
                Be in an environment that is quiet so that your voice is heard clearly and to boost your focus.
              </p>
            </div>

            <div className="prep-row">
              <div className="prep-icon prep-icon-blue" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>
                Try your best! Answer all questions to the best of your ability. Don&apos;t worry or stress as this is
                just a practice interview.
              </p>
            </div>

            <button className="prep-confirm-btn" onClick={handlePrepConfirm}>
              Sounds good
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePage;
