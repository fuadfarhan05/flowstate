import '../App.css'
import { FaArrowUp } from "react-icons/fa";
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
            minWidth: '500px'
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
                borderColor: '#73e3ff',
                borderWidth: '10px',
                borderRadius:'40px',
                 boxShadow:
    'inset 5px 5px 15px rgba(0, 0, 0, 0.3), inset -5px -5px 15px rgba(255, 255, 255, 0.2);' 
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
  return (
    <div class="card"
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
        transition: 'all 0.3s ease',
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

      <ul style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '18px', opacity: 0.9 , fontWeight: '700', color: "white"  }}>
        {bullets.map((bullet, i) => (
          <li key={i} style={{ fontSize: '17px' }}>
            {bullet.replace(/^-\s*/, '')}
          </li>
        ))}
      </ul>
     <button class="go-btn"><FaArrowUp /></button>
    </div>
  );
};

export default AnalysisPreview;
