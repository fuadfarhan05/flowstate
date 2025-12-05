import '../App.css'
import { useLocation } from 'react-router-dom';


function AnalysisPreview() {
  const location = useLocation();
  const pdf = location.state?.pdf;
  return (
    <div className="App">
      <div>
        <h2 style={{ color: 'white' }}>FlowState</h2>
        <div class="page">
          <div class="page-content">
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
    </div>
  );
}

export default AnalysisPreview;
