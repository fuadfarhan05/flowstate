import "./styles/App.css";
import { useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import CreatePage from "./pages/createpage";
import ElevenLabs from "./components/elevenlabcomp";
import Results from "./pages/resultspage";
import AccessPage from "./pages/accessform";
import FillerWordsPage from "./pages/fillerwords";
import FeaturesPage from "./pages/Features";



function ProtectedRoute({ children, hasAccess }) {
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [hasAccess, setHasAccess] = useState(false);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AccessPage hasAccess={hasAccess} onAccessGranted={() => setHasAccess(true)} />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute hasAccess={hasAccess}>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute hasAccess={hasAccess}>
                <ElevenLabs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute hasAccess={hasAccess}>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fillerwords"
            element={
              <ProtectedRoute hasAccess={hasAccess}>
                <FillerWordsPage />
              </ProtectedRoute>
            }
          />

          <Route
              path="/features"
              element={
                <ProtectedRoute hasAccess={hasAccess}>
                  <FeaturesPage />
                </ProtectedRoute>
              }
            />
        </Routes>

    
      </Router>
    </div>
  );
}

export default App;
