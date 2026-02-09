 import { useEffect } from "react";
import "../styles/landing.css";

import UploadImg from "../images/flowstateuploadimg.png";
import SessionImg from "../images/sessions.png";
import grade from "../images/grade.png";
import logo from "../images/flowstatelogo.png";

import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  function LoginNavigation() {
    navigate("/LoginPage");
  }

  // Load Tally script once
  useEffect(() => {
    if (document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="background">
      <div className="navbar">
        <nav className="glass-navbar">
          <div className="nav-left" style={{ display: "flex" }}>
            <img
              style={{ width: "50px", height: "50px" }}
              src={logo}
              alt="flowstate-logo"
            />
          </div>

          <ul className="nav-links">
            <li>Features</li>
            <li>Join Our Waitlist</li>
            <li>Our Mission</li>
            <li>Pricing</li>
          </ul>

          <button className="nav-btn" onClick={LoginNavigation}>
            Log In
          </button>
        </nav>
      </div>

      <p style={{ color: "#7f9bff", fontSize: "20px", marginTop: "150px" }}>
        Enter Your
      </p>

      <div className="title">
        <div style={{ display: "flex" }}>
          <h1 style={{ marginTop: "30px", color: "white", fontSize: "60px" }}>
            FlowState
          </h1>
          <img
            style={{ marginTop: "15px", width: "100px", height: "100px" }}
            src={logo}
            alt="flowstate-logo"
          />
        </div>

        <p style={{ color: "#c0c0c0", fontSize: "30px" }}>
          The Proper Training You Need Before The Interview
        </p>
      </div>

      {/* CTA BUTTONS */}
      <div className="buttons-place">
        <button
          className="get-started"
          data-tally-open="2EN49e"
          data-tally-layout="modal"
          data-tally-width="400"
          data-tally-overlay="1"
          data-tally-emoji-text="👋"
          data-tally-emoji-animation="wave"
          data-tally-auto-close="0"
          data-tally-form-events-forwarding="1"
        >
          Join Our WaitList
        </button>

        <button className="learn-more-btn">Learn More</button>
      </div>

      <div className="grade-card">
        <div className="grade-left">
          <p className="badge">CLEAR PROGRESSION</p>
          <h1>
            Real Time Feedback.
            <br />
            <span>Unlimited Practice.</span>
          </h1>
          <p className="subtitle">
            Practice behavioral interviews with instant AI feedback so you can
            focus on improving, not guessing.
          </p>
        </div>

        <div className="grade-right">
          <img
            style={{ width: "500px" }}
            src={grade}
            alt="FlowState resume parsing diagram"
          />
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <img
            style={{ width: "500px", marginLeft: "50px" }}
            src={UploadImg}
            alt="FlowState resume parsing diagram"
          />
          <p className="section-label">UNDERSTAND YOUR EXPERIENCE</p>
          <h2>Resume Based Context</h2>
          <p className="description">
            Gives you the script you need to practice to speak confidently and
            fluently about your experiences.
          </p>
        </div>

        <div className="feature-card">
          <img
            style={{ width: "600px", marginLeft: "-70px" }}
            src={SessionImg}
            alt="FlowState speaking practice"
          />
          <p className="section-label">PREPARATION WITH PRACTICE</p>
          <h2>Speaking Practice</h2>
          <p className="description">
            Improve speaking confidence and skills for your interviews with
            grades and feedback.
          </p>
        </div>
      </div>

      <section className="testimonials">
        <p className="eyebrow">TESTIMONIALS</p>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              The idea of FlowState originated when I didn’t find any easy way
              to learn how to speak confidently. I also didn’t know how to
              prepare for an interview without having another person test me.
              <br />
              <br />– Fuad <strong>(Founder of FlowState)</strong>
            </p>
          </div>

          <div className="testimonial-card">
            <p>
              FlowState was never just a project for us — it was personal.
              We experienced how unpredictable the job market is and knew
              there had to be a better way.
              <br />
              <br />– Rayat <strong>(Co-Founder of FlowState)</strong>
            </p>
          </div>

          <div className="testimonial-card">
            <p>
              FlowState helped me understand my resume and gave me scripts
              that actually worked in real interviews.
              <br />
              <br />– Kyle <strong>(Engineer @ FlowState)</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
