import "../styles/archivestyle.css";

function GradeArchives() {
  return (
    <div className="archive-page">
      <div className="archive-shell">

        <div className="archive-top">
          <div>
            <h1 className="archive-title">Grade Archives</h1>
          </div>
          <button className="archive-new-btn">+ New Session</button>
        </div>

        <div className="archive-list">

          <div className="archive-card">
            <div className="grade-badge grade-badge--blue">90</div>
            <div className="archive-card-body">
              <p className="archive-feedback">
                Great accuracy and fluency. Next steps for you is to reduce
                filler words like "um", "uh", and "you know".
              </p>
              <span className="archive-date">Apr 13, 2026</span>
            </div>
          </div>

          <div className="archive-card">
            <div className="grade-badge grade-badge--green">88</div>
            <div className="archive-card-body">
              <p className="archive-feedback">
                Good job on being specific and detailed. Don't forget to include
                the impact you made for the experience you speak about.
              </p>
              <span className="archive-date">Mar 23, 2026</span>
            </div>
          </div>

          <div className="archive-card">
            <div className="grade-badge grade-badge--yellow">74</div>
            <div className="archive-card-body">
              <p className="archive-feedback">
                Missing an opening line which causes some confusion on which
                experience you are talking about. Try to keep your answers
                concise and reduce filler words like "um", "uh", and "you know".
              </p>
              <span className="archive-date">Jan 1, 2026</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default GradeArchives;
