import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import AnalysisPreview from "./pages/analysishome";
import InterviewSimulation from "./pages/interviewsim";
import Landing from "./pages/landingpage";
import GradeArchives from "./pages/gradearchives";
import CreatePage from "./pages/createpage";
import ElevenLabs from "./components/elevenlabcomp";

import Results from "./pages/resultspage";
import LoginPage from "./pages/loginpage";
import SignUpPage from "./pages/signuppage";
import AccessPage from "./pages/accessform";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={< AccessPage />} />
          <Route path="/interview" element={<ElevenLabs />} />
          <Route path="/results" element={<Results />} />
          

        </Routes>
      </Router>
    </div>
  );
}

export default App;
