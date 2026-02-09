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
    if (
      document.querySelector(
        'script[src="https://tally.so/widgets/embed.js"]'
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="background">
      {/* NAVBAR */}
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

            <li>
              <a
                href="#pricing"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Pricing
              </a>
            </li>

            <li>
              <a
                href="#tally-open=2EN49e&tally-layout=modal&tally-width=400&tally-overlay=1"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                Join Our Waitlist
              </a>
            </li>

            <li>Our Mission</li>

            <li>
              <a
                href="#faq"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                FAQ
              </a>
            </li>

         



          </ul>

          <button className="nav-btn" onClick={LoginNavigation}>
            Log In
          </button>
        </nav>
      </div>

      {/* HERO */}
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
        >
          Join Our Waitlist
        </button>

        <button
          className="learn-more-btn"
          onClick={() =>
            document
              .getElementById("pricing")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          View Pricing
        </button>
      </div>

      {/* GRADE SECTION */}
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
            alt="FlowState grading"
          />
        </div>
      </div>

      {/* FEATURES */}
      <div className="feature-grid" id="features">
        <div className="feature-card">
          <img
            style={{ width: "550px", marginRight: "-10px" }}
            src={UploadImg}
            alt="Resume upload"
          />
          <p className="section-label">UNDERSTAND YOUR EXPERIENCE</p>
          <h2>Resume Based Context</h2>
          <p className="description">
            Gives you the script you need to practice confidently about your
            experiences.
          </p>
        </div>

        <div className="feature-card">
          <img
            style={{ width: "640px", marginLeft: "-70px" }}
            src={SessionImg}
            alt="Practice sessions"
          />
          <p className="section-label">PREPARATION WITH PRACTICE</p>
          <h2>Speaking Practice</h2>
          <p className="description">
            Improve speaking confidence with real-time grades and feedback.
          </p>
        </div>
      </div>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <p className="eyebrow">PRICING</p>
        <p className="pricing-subtitle">
          Start free. Upgrade only when you’re ready to go all in.
        </p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <p className="plan-name">Free</p>
            <h3 className="price">$0</h3>
            <ul className="plan-features">
              <li>✓ Limited interview sessions</li>
              <li>✓ Resume upload</li>
              <li>✓ Basic AI feedback</li>
            </ul>
            <button className="pricing-btn secondary" data-tally-open="2EN49e">
              Join Waitlist
            </button>
          </div>

          <div className="pricing-card featured">
            <p className="plan-name">Pro</p>
            <h3 className="price">
              $15<span>/mo</span>
            </h3>
            <ul className="plan-features">
              <li>✓ Unlimited practice</li>
              <li>✓ Resume-based probing</li>
              <li>✓ Detailed feedback</li>
            </ul>
            <button className="pricing-btn primary" data-tally-open="2EN49e">
              Get Early Access
            </button>
          </div>

          <div className="pricing-card">
            <p className="plan-name">Lifetime</p>
            <h3 className="price">$30</h3>
            <ul className="plan-features">
              <li>✓ Everything in Pro</li>
              <li>✓ Priority support</li>
              <li>✓ Future updates</li>
            </ul>
            <button className="pricing-btn secondary" data-tally-open="2EN49e">
              Contact Us
            </button>
          </div>
        </div>
      </section>


      {/* FAQ */}
<section className="faq-section" id="faq">
  <p className="eyebrow">FAQ</p>
  <h2 className="faq-title">Frequently Asked Questions</h2>

  <div className="faq-grid">
    <details className="faq-item">
      <summary>What is FlowState?</summary>
      <p>
        FlowState is an AI-powered interview training platform that helps you
        practice speaking confidently, get real-time feedback, and improve how
        you communicate your experiences.
      </p>
    </details>

    <details className="faq-item">
      <summary>Is FlowState free to use?</summary>
      <p>
        Yes! You can start for free with limited interview sessions. When you’re
        ready, you can upgrade to unlock unlimited practice and advanced
        feedback.
      </p>
    </details>

    <details className="faq-item">
      <summary>What kind of interviews does FlowState help with?</summary>
      <p>
        FlowState focuses on behavioral and experience-based interviews, helping
        you clearly explain your resume, projects, and past roles.
      </p>
    </details>

    <details className="faq-item">
      <summary>Do I need an interviewer or partner?</summary>
      <p>
        Nope. FlowState acts as your interviewer and coach, so you can practice
        anytime without needing another person.
      </p>
    </details>

    <details className="faq-item">
      <summary>When will FlowState be fully available?</summary>
      <p>
        We’re currently onboarding early users through our waitlist. Join now
        to get early access and help shape the product.
      </p>
    </details>
  </div>
</section>


      {/* TESTIMONIALS */}
      <section className="testimonials">
        <p className="eyebrow">TESTIMONIALS</p>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              FlowState was born from the struggle of learning how to speak
              confidently.
              <br />
              <br />– Fuad <strong>(Founder)</strong>
            </p>
          </div>

          <div className="testimonial-card">
            <p>
              We knew there had to be a better way to prepare for interviews.
              <br />
              <br />– Rayat <strong>(Co-Founder)</strong>
            </p>
          </div>

          <div className="testimonial-card">
            <p>
              The scripts and feedback actually work in real interviews.
              <br />
              <br />– Kyle <strong>(Engineer)</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
