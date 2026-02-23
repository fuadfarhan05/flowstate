import "./styles/App.css";
import { useState } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import CreatePage from "./pages/createpage";
import ElevenLabs from "./components/elevenlabcomp";
import Results from "./pages/resultspage";
import AccessPage from "./pages/accessform";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
