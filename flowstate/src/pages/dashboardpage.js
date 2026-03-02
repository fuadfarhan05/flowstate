import React, { useEffect, useState } from "react";
import "../styles/dashboardpage.css";

import { useNavigate } from "react-router-dom";

function DashboardPage() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("there");

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




  return (
    <div className="dashboard-page">
      <main className="dashboard-shell" aria-label="Dashboard">
        <header className="dashboard-top">
          <div>
            <h1>Welcome back, {displayName}</h1>
            <p className="dashboard-subtitle">
                Enter your FlowState
            </p>
          </div>

          <div className="dashboard-actions">
            <button className="dashboard-btn dashboard-btn-muted" onClick={goArchives}>See Archive</button>
            <button className="dashboard-btn dashboard-btn-primary" onClick={goTest}>Start New Test</button>
          </div>
        </header>

        <section className="dashboard-hero-card">
          

          <div className="hero-progress-wrap">
            <div className="hero-progress-ring">
              <span>82%</span>
            </div>
            <p>Readiness Score</p>
          </div>
        </section>

        

            <button className="dashboard-btn dashboard-btn-primary full-width" onClick={goFillerWords}>Reduce Filler Words Practice</button>

          <aside className="panel panel-side">
            <h3>Today’s Plan</h3>
            <ul>
              <li>1 mock interview (35 min)</li>
              <li>Review 3 weak responses</li>
              <li>Practice STAR openings</li>
            </ul>
            <div className="side-divider" />
            <p className="side-note">You are 2 sessions away from your weekly goal.</p>
            <button className="dashboard-btn dashboard-btn-primary full-width">Test Me</button>
          </aside>
      </main>
    </div>
  );
}

export default DashboardPage;
