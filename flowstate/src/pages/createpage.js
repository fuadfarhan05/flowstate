import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSheetPlastic } from "react-icons/fa6";

import Aurora from "../backgrounds/Aurora.js";
import "../styles/createpage.css";

function CreatePage() {
  const navigate = useNavigate();
  const [upload, setUpload] = useState(null);
  const fileInputRef = useRef(null);

  function handleUpload(event) {
    const file = event.target.files[0];
    setUpload(file);
  }

  function triggerUpload() {
    fileInputRef.current.click();
  }

  const handleSubmit = async () => {
    if (!upload) return;

    const formData = new FormData();
    formData.append("upload", upload);

    try {
      // 1️⃣ Parse resume
      const response = await fetch("http://localhost:8000/parse-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();


      const normalizedExperiences = Object.keys(data.experiences);


      // 3️⃣ Generate interview questions
      const genResponse = await fetch(
        "http://localhost:5434/api/v1/generate-experiencequestions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            experiences: normalizedExperiences,
          }),
        }
      );

      const genData = await genResponse.json();

      // 4️⃣ Navigate with ONLY the questions array
      navigate("/interview", {
        state: {
          questions: genData.questions,
        },
      });
    } catch (error) {
      console.error("Failed to create interview session:", error);
    }
  };

  return (
    <div className="create-container">
      <div className="main-card">
        <div className="header">
          <h3>Create Interview Session</h3>
        </div>

        <div className="section">
          <label>Upload your resume</label>
          <div className="upload-box">
            <button
              style={{
                color: "white",
                background: "none",
                border: "none",
                fontSize: "80px",
              }}
              onClick={triggerUpload}
            >
              <FaSheetPlastic />
              <p>click here to upload</p>
            </button>

            {upload && <p className="upload-name">🔗 {upload.name}</p>}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <button className="start-btn" onClick={handleSubmit}>
          Start Session
        </button>
      </div>
    </div>
  );
}

export default CreatePage;
