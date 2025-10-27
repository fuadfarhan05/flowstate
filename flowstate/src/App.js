import './App.css';
import { useState, useRef } from 'react';
import { FaArrowUp } from "react-icons/fa";
import LiquidEther from './background';

function App() {
  const [upload, setUpload] = useState(null);
  const fileInputRef = useRef(null);

  function handleUpload(event) {
    const file = event.target.files[0];
    setUpload(file);
  };

  function triggerUpload() {
    fileInputRef.current.click(); 
  }

  const handleSubmit = async () => {
    if(!upload) {
      return;
    }

    const formData = new FormData();
    formData.append("upload", upload);

    try {
      const response = await fetch(`http://localhost:3500//api/v1/endpoint1/Resume`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("upload working",data);

    } catch(error) {
      console.log('failed to upload resume')

    }

  }

  return (
    <div className="App">
      {/* LiquidEther background */}
      <div className="liquid-ether-container">
        <LiquidEther
          style={{ width: '100%', height: '100%' }}  // important!
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <header className="App-header">
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

export default App;
