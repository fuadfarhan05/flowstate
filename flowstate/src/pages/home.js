import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp } from "react-icons/fa";
import { FaSheetPlastic } from "react-icons/fa6";


//import Particles from '../backgrounds/particles';
import Aurora from '../backgrounds/Aurura.js';
  
import "../styles/App.css"

function Home() {
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
    const response = await fetch("http://localhost:8000/parse-resume", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("upload working", data);

    navigate('/analysis', {
      state: {
        pdf: upload,
        experiences: data.experiences
      }
    });

  } catch (error) {
    console.log('failed to upload resume', error);
  }
};


  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        >
          <Aurora
            color1="#5a90e7"
            color2="#a3c4f0"
            color3="#1190df"
            blend={0.53}
          />
        </div>

        <h1 style={{marginBottom:'-5px'}}>FlowState</h1>
        <p style={{color:'#c0c0c0'}}>The Proper Training You Need Before The Interview</p>

        <div className="wrapper">
          <p style={{fontSize: '18px', color: 'white'}}>Upload Your Resume</p>
          <p style={{color:'#b5b5b5', fontSize:'80px'}}><FaSheetPlastic /></p>
          <button className="button" onClick={handleSubmit}><FaArrowUp /></button>
          <button className="secondary-button" onClick={triggerUpload}>+</button>

          {upload && <p className="upload-name">🔗 {upload.name}</p>}

          <input
            type="file"
            //name="ResumeFile"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </div>
      </header>
    </div>
  );
}

export default Home;