import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import AnalysisPreview from "./pages/analysishome";
import Landing from "./pages/landingpage";
import GradeArchives from "./pages/gradearchives";
import CreatePage from "./pages/createpage";
import ElevenLabs from "./components/elevenlabcomp";

import Results from "./pages/resultspage";
import LoginPage from "./pages/loginpage";
import SignUpPage from "./pages/signuppage";
import DashboardPage from "./pages/dashboardpage";
import FillerWordsPage from "./pages/fillerwords";

function isAuthenticated() {
  const token = localStorage.getItem("authToken");
  return Boolean(token && token.trim());
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/loginpage" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Navigate to="/loginpage" replace />
            }
          />
          <Route
            path="/loginpage"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signuppage"
            element={
              <PublicOnlyRoute>
                <SignUpPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <AnalysisPreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <ElevenLabs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/archives"
            element={
              <ProtectedRoute>
                <GradeArchives />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fillerwords"
            element={
              <ProtectedRoute>
                <FillerWordsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated() ? "/dashboard" : "/loginpage"}
                replace
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
