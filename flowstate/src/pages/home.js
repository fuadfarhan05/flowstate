import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp } from "react-icons/fa";
import Particles from '../backgrounds/particles';
import "../App.css"

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
    

    //potential issue, {missing content-type, 
    try {
      const response = await fetch(`http://localhost:3500/api/v1/Resumeparse`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("upload working", data);

    } catch (error) {
      console.log('failed to upload resume');
    }

    navigate('/analysis', { state: { pdf:upload }});
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
          <Particles
            particleColors={['#c861fcff', '#c383f4ff']}
            particleCount={800}
            particleSpread={15}
            speed={0.2}
            particleBaseSize={450}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>

        <h1>FlowState</h1>

        <div className="wrapper">
          <input type="text" className="input" placeholder="Type here..." />
          <button className="button" onClick={handleSubmit}><FaArrowUp /></button>
          <button className="secondary-button" onClick={triggerUpload}>+</button>

          {upload && <p className="upload-name">🔗 {upload.name}</p>}

          <input
            type="file"
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
