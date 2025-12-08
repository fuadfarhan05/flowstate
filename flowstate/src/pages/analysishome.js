import '../App.css'
import { useLocation } from 'react-router-dom';

function AnalysisPreview() {
  const location = useLocation();
  const pdf = location.state?.pdf;
  // I like tutrles
  return (
    <div className="App">
      <h2 style={{ color: 'white' }}>FlowState</h2>

      {/* Flex container for left card + right PDF */}
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        
        {/* LEFT BLUE CARD */}
        <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '25px',
            }}
          >
            {["Talking Points", "Talking Points", "Talking Points"].map((title, idx) => (
              <div
                key={idx}
                style={{
                  width: '500px',
                  minHeight: '120px',
                  background: 'linear-gradient(135deg, #6fb7d6, #4ba3c7)',
                  borderRadius: '24px',
                  padding: '22px',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(8px)',      // glass effect
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
                }}
              >
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>{title}</h3>
                <p style={{ marginTop: '10px', fontSize: '16px', opacity: 0.9 }}>
                  Your content goes here...
                </p>
              </div>
            ))}
          </div>



        {/* RIGHT PDF VIEWER */}
        <div className="page-content" style={{ flex: 1 }}>
          {pdf ? (
            <iframe
              src={URL.createObjectURL(pdf)}
              width="100%"
              height="990px"
              style={{ border: 'none' }}
            ></iframe>
          ) : (
            <p style={{ color: 'black' }}>No PDF uploaded.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default AnalysisPreview;
