import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import AnalysisPreview from './pages/analysishome';
import InterviewSimulation from './pages/interviewsim';
import Landing from './pages/landingpage';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/home" element={<Home />} />
        <Route path="/analysis" element={<AnalysisPreview />} />
        <Route path="/interview" element={<InterviewSimulation/>} />
      </Routes>
    </Router>
   </div>
  );
}

export default App;
