import { useNavigate } from "react-router-dom";
import "../styles/features.css";

function FeaturesPage() {
  const navigate = useNavigate();

  return (
    <div className="features-page">
      <section className="features-card">
        <h1>Choose a Feature to Test Out</h1>
        <p>Welcome to FlowState's Testing Environment. Below is two of our features. You can choose either to start with first but make sure you test out "Create Interview" feature as there is a survey to give us feedback at the end.</p>

        <div className="features-actions">
          <button
            className="feature-btn"
            type="button"
            onClick={() => navigate("/fillerwords")}
          >
            Reduce Filler Words
          </button>
          <button
            className="feature-btn"
            type="button"
            onClick={() => navigate("/create")}
          >
            Create Interview
          </button>
        </div>
      </section>
    </div>
  );
}

export default FeaturesPage;
