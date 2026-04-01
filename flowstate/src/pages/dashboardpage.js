import React, { useEffect, useState } from "react";
import "../styles/dashboardpage.css";

import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("flowstate user");

    useEffect(() => {
        const savedName = localStorage.getItem("userName");
        if (savedName && savedName.trim()) {
            setDisplayName(savedName.trim());
        }
    }, []);

    function goTest() {
        navigate('/create');
    }

    function goArchives() {
        navigate('/archives');
    }
    

    function goFillerWords() {
      navigate('/fillerwords');
    }

    function goStarMethod() {
      navigate('/starmethod');
    }

    function handleLogout() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        navigate('/loginpage');
    }




  return (
    <div className="dashboard-page">
      <main className="dashboard-shell" aria-label="Dashboard">
        <header className="dashboard-top">
          <div>
            <h2>Welcome back, {displayName}</h2>
          </div>
          <div className="dashboard-actions">
            <button className="dashboard-btn dashboard-btn-muted" onClick={goArchives}>See Archive</button>
            <button className="dashboard-btn dashboard-btn-primary" onClick={goTest}>Start New Test</button>
            <button className="dashboard-btn dashboard-btn-logout" onClick={handleLogout}>Log Out</button>
          </div>
        </header>

        <section className="dashboard-hero-card">
          <div>
            <p className="hero-label">RECENT PERFORMANCE</p>
            <h2>You’re improving fast.</h2>
            <p>Your last session showed strong structure. Focus on cutting filler words to push past 90%.</p>
            <div className="hero-tags">
              <span>Speech Clarity</span>
              <span>Reduced filler words</span>
              <span>STAR Method</span>
              <span>Job Mapping</span>
            </div>
          </div>
          <div className="hero-progress-wrap">
            <div className="hero-progress-ring">
              <span>82%</span>
            </div>
            <p>Recent Score</p>
          </div>
        </section>

        <div className="dashboard-main-grid">
          <section className="panel panel-side">
            <h3>Focus Drills</h3>
            <button
              className="filler-drill-btn full-width"
              onClick={goFillerWords}
              type="button"
            >
              <span className="filler-drill-title">Reduce your filler words</span>
              <span className="filler-drill-visual">
                <span className="filler-drill-chip chip-um">um</span>
                <span className="filler-drill-chip chip-like">Like</span>
                <span className="filler-drill-chip chip-youknow">you know</span>
                <span className="filler-drill-bars" aria-hidden="true">
                  <span className="bar bar-1" />
                  <span className="bar bar-2" />
                  <span className="bar bar-3" />
                  <span className="bar bar-4" />
                  <span className="bar bar-5" />
                  <span className="bar bar-6" />
                </span>
              </span>
            </button>
            <button
              className="filler-drill-btn star-drill-btn full-width"
              onClick={goStarMethod}
              type="button"
            >
              <span className="filler-drill-title">S.T.A.R. stories</span>
              <span className="star-drill-visual" aria-hidden="true">
                <span className="star-chip star-chip-s">S</span>
                <span className="star-chip star-chip-t">T</span>
                <span className="star-chip star-chip-a">A</span>
                <span className="star-chip star-chip-r">R</span>
                <span className="star-sparkle">✦</span>
              </span>
            </button>
          </section>

          <aside className="panel panel-side">
            <h3>[Graph HERE]</h3>
            <ul>
              <li>1 mock interview (35 min)</li>
              <li>Review 3 weak responses</li>
              <li>Practice STAR openings</li>
            </ul>
            <div className="side-divider" />
            <p className="side-note">You are 2 sessions away from your weekly goal.</p>
            <button className="dashboard-btn dashboard-btn-primary full-width" onClick={goTest}>Test Me</button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
