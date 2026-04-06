import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSheetPlastic } from "react-icons/fa6";
import { FaMicrophone, FaVolumeXmark, FaStar } from "react-icons/fa6";

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
            <div className="prep-modal-header">
              <span className="prep-modal-eyebrow">You&apos;re almost in</span>
              <h2 className="prep-modal-title">Before you begin</h2>
              <p className="prep-modal-subtitle">A few things to set you up for success</p>
            </div>

            <div className="prep-tips">
              <div className="prep-tip">
                <div className="prep-tip-icon prep-tip-icon--blue">
                  <FaMicrophone />
                </div>
                <div className="prep-tip-body">
                  <span className="prep-tip-label">Microphone</span>
                  <p className="prep-tip-text">Make sure your microphone is on — FlowState listens to your spoken answers in real time.</p>
                </div>
              </div>

              <div className="prep-tip">
                <div className="prep-tip-icon prep-tip-icon--gold">
                  <FaVolumeXmark />
                </div>
                <div className="prep-tip-body">
                  <span className="prep-tip-label">Quiet environment</span>
                  <p className="prep-tip-text">Find a quiet space so your voice is captured clearly and you can stay focused.</p>
                </div>
              </div>

              <div className="prep-tip">
                <div className="prep-tip-icon prep-tip-icon--purple">
                  <FaStar />
                </div>
                <div className="prep-tip-body">
                  <span className="prep-tip-label">Give it your best</span>
                  <p className="prep-tip-text">Answer every question as fully as you can. This is practice — no pressure, just progress.</p>
                </div>
              </div>
            </div>

            <button className="prep-confirm-btn" onClick={handlePrepConfirm}>
              Let&apos;s go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePage;
