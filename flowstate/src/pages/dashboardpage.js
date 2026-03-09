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




  return (
    <div className="dashboard-page">
      <main className="dashboard-shell" aria-label="Dashboard">
        <header className="dashboard-top">
          <div>
            <h1>Welcome back, {displayName}</h1>
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
            <p>Recent Score</p>
          </div>
        </section>

        

          <section className="panel panel-side">
            <h3>Focus Drills</h3>
            <button
              className="filler-drill-btn full-width"
              onClick={goFillerWords}
              type="button"
            >
              <span className="filler-drill-title">Reduce your filler words</span>

              <span className="filler-drill-visual">
                <span className="filler-drill-chip chip-um">( um )</span>
                <span className="filler-drill-chip chip-like">( Like )</span>
                <span className="filler-drill-chip chip-youknow">( you know )</span>
                <span className="filler-drill-chip chip-pretty">( pretty much )</span>

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
          </section>

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
