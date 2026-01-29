import "../styles/landing.css";
import UploadImg from "../images/flowstateuploadimg.png";
import grade from "../images/grade.png";
import logo from "../images/flowstatelogo.png";

function Landing() {
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
            <li>Our Mission</li>
            <li>Testimonial</li>
            <li>Pricing</li>
          </ul>

          <button className="nav-btn">Sign In</button>
        </nav>
      </div>

      <p style={{ color: "#7f9bff", fontSize: "20px", marginTop: "150px" }}>
        Enter Your
      </p>

      <div className="title">
        <div style={{ display: "flex" }}>
          <h1 style={{ marginTop: "30px", color: 'white', fontSize:'60px' }}>FlowState</h1>
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
      <div className="buttons-place">
        <button className="get-started">Get Started</button>
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
            style={{ width: "550px" }}
            src={UploadImg}
            alt="FlowState resume parsing diagram"
          />
          <p className="section-label">UNDERSTANDS YOUR EXPERIENCE</p>
          <h2>Resume Based Context</h2>
          <p className="description">
            Gives you the script you need to practice to speak confidentally and
            fluenty about your experiences.
          </p>
        </div>

        <div className="feature-card">
          <p className="section-label">PREPARATION WITH PRACTICE</p>
          <h2>Speaking Practice</h2>
          <p className="description">
            Improve speaking confidence and skills for your interviews and with
            grades and feedback.
          </p>
        </div>
      </div>

      <section className="testimonials">
        <p className="eyebrow">TESTIMONIALS</p>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>
              The idea of FlowState originated when I didn't find any easy way
              to learn how to speak confidentally. I also didn't know how to
              prepare for an interview without having to ask another person test
              me. My priority for FlowState was to make sure it can help users
              with both being prepared and confident.<br></br>
              <br></br> - Fuad <strong>(Founder of FlowState)</strong>
            </p>
          </div>

          <div className="testimonial-card">
            <p>
              FlowState was never just a project for Fuad and I, it was
              personal. We both experienced how unpredictable the job market can
              be, where even landing an internship feels uncertain. We’d quiz
              each other, run mock interviews, and review resumes, but it never
              matched the pressure of the real thing. We knew there had to be a
              better way. That’s why we built FlowState.
              <br></br>
              <br></br> - Rayat <strong>(Co-Founder of FlowState)</strong>
            </p>
          </div>

          <div className="testimonial-card">
            <p>
              Using flowstate helped me understand my resume more and gave me
              scripts to improve on real interviews. <br></br>
              <br></br> - Kyle <strong>- Engineer @ FlowState</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
