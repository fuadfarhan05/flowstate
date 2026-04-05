import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSheetPlastic } from "react-icons/fa6";

import "../styles/createpage.css";

function CreatePage() {
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const [jobMappingOpen, setJobMappingOpen] = useState(false);
  const [mappingRole, setMappingRole] = useState("");
  const [mappingCompany, setMappingCompany] = useState("");
  const [mappingPosting, setMappingPosting] = useState("");
  const [mappingLoading, setMappingLoading] = useState(false);
  const [mappingInferences, setMappingInferences] = useState(null);
  const [loadingStep, setLoadingStep] = useState(null); // null | "parsing" | "generating"

  const fileInputRef = useRef(null);

  function handleUpload(event) {
    const file = event.target.files[0];
    setUpload(file);
  }

  function triggerUpload() {
    fileInputRef.current.click();
  }

  const handleGenerateSuggestions = async () => {
    if (!mappingPosting.trim()) return;
    setMappingLoading(true);
    setMappingInferences(null);
    try {
      const res = await fetch("http://localhost:5434/api/v1/job-mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosting: mappingPosting,
          targetRole: mappingRole && mappingCompany ? `${mappingRole} at ${mappingCompany}` : undefined,
        }),
      });
      const data = await res.json();
      setMappingInferences(data.inferences);
    } catch (error) {
      console.error("Failed to generate job mapping:", error);
    } finally {
      setMappingLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!upload) return;

    const formData = new FormData();
    formData.append("upload", upload);

    try {
      setLoadingStep("parsing");

      // 1️⃣ Parse resume
      const response = await fetch("http://localhost:8000/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const normalizedExperiences = Object.keys(data.experiences);

      setLoadingStep("generating");

      // 2️⃣ Generate opener questions (one per experience)
      const genResponse = await fetch(
        "http://localhost:5434/api/v1/generate-experiencequestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experiences: normalizedExperiences,
            experienceDetails: data.experiences,
            targetRole: mappingRole && mappingCompany ? `${mappingRole} at ${mappingCompany}` : undefined,
          }),
        }
      );

      const genData = await genResponse.json();

      navigate("/interview", {
        state: {
          questions: genData.questions,
          experiences: normalizedExperiences,
        },
      });
    } catch (error) {
      console.error("Failed to create interview session:", error);
      setLoadingStep(null);
    }
  };

  if (loadingStep) {
    return (
      <div className="create-container">
        <div className="main-card loading-card">
          <div className="loader-orb">
            <div className="loader-ring loader-ring--1" />
            <div className="loader-ring loader-ring--2" />
            <div className="loader-ring loader-ring--3" />
            <div className="loader-core" />
          </div>

          <div className="loader-steps">
            <div className={`loader-step ${loadingStep === "parsing" || loadingStep === "generating" ? "loader-step--active" : ""} ${loadingStep === "generating" ? "loader-step--done" : ""}`}>
              <span className="loader-step-dot" />
              <span className="loader-step-text">Scanning resume</span>
            </div>
            <div className={`loader-step ${loadingStep === "generating" ? "loader-step--active" : ""}`}>
              <span className="loader-step-dot" />
              <span className="loader-step-text">Building your interview</span>
              <span className="loader-step-text">Get ready! your interview is about to start</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-container">
      <div className="main-card">

        <div className="header">
          <h3>Create Interview Session</h3>
          <p>Upload your resume to get started</p>
        </div>

        {/* Upload Section */}
        <div className="section">
          <label>Resume</label>

          <div className={`upload-box ${upload ? "upload-box--filled" : ""}`} onClick={triggerUpload}>
            <FaSheetPlastic className="upload-icon" />
            {upload ? (
              <p className="upload-name">{upload.name}</p>
            ) : (
              <p className="upload-hint">Click to upload your resume</p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Job Mapping */}
        <button className="job-mapping-btn" onClick={() => setJobMappingOpen(true)}>
          FlowState Exclusive Job Mapping
        </button>

        {/* Job Mapping Modal */}
        {jobMappingOpen && (
          <div className="modal-overlay" onClick={() => setJobMappingOpen(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>FlowState Exclusive</h3>
                <button className="modal-close" onClick={() => setJobMappingOpen(false)}>✕</button>
              </div>
              {mappingInferences ? (
                <>
                  <div className="modal-inferences">
                    {mappingInferences.map((item, i) => (
                      <div key={i} className="modal-inference-card">
                        <p className="modal-inference-title">{item.title}</p>
                        <p className="modal-inference-desc">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <button className="modal-generate-btn" onClick={() => setMappingInferences(null)}>
                    Back
                  </button>
                </>
              ) : (
                <>
                  <p className="modal-body">Instead of researching for long hours about the company's needs, FlowState's Job Mapping System will analyzing the Job posting for you and teach you how to speak about your experiences in a way that is relevant to the job potentially increasing your chances of getting hired!</p>

                  <div className="modal-fields">
                    <div className="modal-role-row">
                      <input
                        className="modal-input-sm"
                        type="text"
                        placeholder="Role"
                        value={mappingRole}
                        onChange={(e) => setMappingRole(e.target.value)}
                      />
                      <span className="modal-role-at">at</span>
                      <input
                        className="modal-input-sm"
                        type="text"
                        placeholder="Company"
                        value={mappingCompany}
                        onChange={(e) => setMappingCompany(e.target.value)}
                      />
                    </div>
                    <textarea
                      className="modal-textarea"
                      placeholder="Paste the job posting here..."
                      value={mappingPosting}
                      onChange={(e) => setMappingPosting(e.target.value)}
                    />
                  </div>

                  <button
                    className={`modal-generate-btn ${mappingLoading ? "modal-generate-btn--loading" : ""}`}
                    onClick={handleGenerateSuggestions}
                    disabled={mappingLoading || !mappingPosting.trim()}
                  >
                    {mappingLoading ? "Analyzing..." : "Generate Suggestions"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          className={`start-btn ${!upload ? "start-btn--disabled" : ""}`}
          onClick={handleSubmit}
          disabled={!upload}
        >
          Start Session
        </button>
      </div>
    </div>
  );
}

export default CreatePage;
