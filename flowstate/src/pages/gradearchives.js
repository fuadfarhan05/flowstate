import "../styles/archivestyle.css";

function GradeArchives() {
  return (
    <div className="body">
      <button className="start-btn">Create New Session</button>

      <div className="archive-list">
        <div className="glass-container">
          <div className="container-content">
            <div className="grade-circle blue">90</div>
            <div className="feedback-text">
              <p>
                Great Accuracy and Fluency. Next steps for you is to reducing
                filler words like “um”, “uh”, and “you know”.
              </p>
            </div>
            <div className="date">
              <p>Apr 13, 2026</p>
            </div>
          </div>
        </div>
        <div className="glass-container">
          <div className="container-content">
            <div className="grade-circle green">88</div>
            <div className="feedback-text">
              <p>
                Good job on being specific and detailed. Don’t forget to include
                the impact you made for the experience you speak about.
              </p>
            </div>
            <div className="date">
              <p>Mar 23, 2026</p>
            </div>
          </div>
        </div>
        <div className="glass-container">
          <div className="container-content">
            <div className="grade-circle">74</div>
            <div className="feedback-text">
              <p>
                Missing an opening line which causes some confusion on which
                experience you are talking about. Try to keep you answers
                concise and reduce filler words like “um” and “uh” and “you
                know”.
              </p>
            </div>
            <div className="date">
              <p>Jan 1, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradeArchives;
