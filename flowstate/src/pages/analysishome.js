import '../App.css'
import { useLocation } from 'react-router-dom';

function AnalysisPreview() {
  const location = useLocation();
  const pdf = location.state?.pdf;
  return (
    <div className="App">
      <h2 style={{ color: 'white' }}>FlowState</h2>

      {/* FLEX ROW: LEFT CARDS + RIGHT PDF */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>

        {/* LEFT SIDE — CARDS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minWidth: '500px'
          }}
        >

          {/* CARD 1 */}
          <div
            style={{
              width: '500px',
              height: '15px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #6fb7d6, #4ba3c7)',
              borderRadius: '24px',
              padding: '22px',
              color: 'white',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              marginLeft: '10px',
            }}
            onMouseEnter={e => e.currentTarget.style.height = '160px'}
            onMouseLeave={e => e.currentTarget.style.height = '15px'}
          >
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>[experience]</h3>
            <p style={{ marginTop: '10px', fontSize: '16px', opacity: 0.9 }}>[what to say]</p>
          </div>

          {/* CARD 2 */}
          <div
            style={{
              width: '500px',
              height: '15px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #6fb7d6, #4ba3c7)',
              borderRadius: '24px',
              padding: '22px',
              color: 'white',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              marginLeft: '10px',
            }}
            onMouseEnter={e => e.currentTarget.style.height = '160px'}
            onMouseLeave={e => e.currentTarget.style.height = '15px'}
          >
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>[experience]</h3>
            <p style={{ marginTop: '10px', fontSize: '16px', opacity: 0.9 }}>[what to say]</p>
          </div>

          {/* CARD 3 */}
          <div
            style={{
              width: '500px',
              height: '15px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #6fb7d6, #4ba3c7)',
              borderRadius: '24px',
              padding: '22px',
              color: 'white',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              marginLeft: '10px',
            }}
            onMouseEnter={e => e.currentTarget.style.height = '160px'}
            onMouseLeave={e => e.currentTarget.style.height = '15px'}
          >
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>[experience]</h3>
            <p style={{ marginTop: '10px', fontSize: '16px', opacity: 0.9 }}>[what to say]</p>
          </div>

        </div>

        {/* RIGHT SIDE — PDF VIEWER */}
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
