import '../App.css'
import { BsStars } from "react-icons/bs";
import { useState } from "react";
import { useLocation } from 'react-router-dom';

function AnalysisPreview() {
  const location = useLocation();

  const experiences = location.state?.experiences || {};
  const pdf = location.state?.pdf;

  const experienceEntries = Object.entries(experiences);

  return (
    <div className="App">
      <h2 style={{ color: 'white' }}>FlowState</h2>

      {/* FLEX ROW */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>

        {/* LEFT SIDE — DYNAMIC CARDS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: '500px',
            marginTop: '30px',
            marginLeft: '20px'
          }}
        >
          {experienceEntries.map(([title, bullets], index) => (
            <ExperienceCard
              key={index}
              title={title}
              bullets={bullets}
            />
          ))}
        </div>

        {/* RIGHT SIDE — PDF */}
        <div class="page-content">
          {pdf ? (
            <iframe
              src={URL.createObjectURL(pdf)}
              style={{
                width: '90%',
                height: '100%',
                borderColor: '#a3e7ffff',
                borderWidth: '5px',
                borderRadius:'10px'
              }}
            />
          ) : (
            <p style={{ color: 'black' }}>No PDF uploaded.</p>
          )}
        </div>


      </div>
    </div>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

const ExperienceCard = ({ title, bullets }) => {
  const [aiScript, setAIScript] = useState("");
  const [loading, setLoading] = useState(false);

  const generateScript = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5434/api/v1/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, bullets }),
      });

      const data = await res.json();
      setAIScript(data.script);
    } catch (error) {
      console.error("Failed to generate script", error);
      setAIScript("Failed to generate script. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`card ${loading ? "loading" : ""}`} // <-- pulse class when loading
      style={{
        width: '500px',
        height: '10px',
        overflow: 'hidden',
        background: '#4c575cff',
        borderRadius: '30px',
        padding: '22px',
        color: 'white',
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.6),
          0 2px 4px rgba(0,0,0,0.18),
          0 8px 20px rgba(0,0,0,0.25),
          0 16px 40px rgba(0,0,0,0.22)
        `,
        transition: 'all 0.7s ease',
        cursor: 'pointer',
        position: 'relative',
        marginLeft: '10px',
      }}
      onMouseEnter={e => e.currentTarget.style.height = '350px'}
      onMouseLeave={e => e.currentTarget.style.height = '12px'}
    >
      <h3 style={{ margin: 0, fontSize: '25px', fontWeight: '700', color: "white" }}>
        {title}
      </h3>

      <ul style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '18px', opacity: 0.9, color: "white" }}>
        {loading ? (
          <li style={{ fontSize: '17px', fontStyle: 'italic' }}>
          </li>
        ) : aiScript ? (
          <li style={{ fontSize: '18px', opacity: 1.0 }} className="generate-text">
            {aiScript}
          </li>
        ) : (
          bullets.map((bullet, i) => (
            <li key={i} style={{ fontSize: '17px' }}>
              {bullet.replace(/^-\s*/, '')}
            </li>
          ))
        )}
      </ul>

      <button className="go-btn" onClick={generateScript}>
        Generate Script <BsStars/>
      </button> 
    </div>
  );
};


export default AnalysisPreview;
