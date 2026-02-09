import { useLocation } from 'react-router-dom';

import '../styles/results.css';


function Results () {
    const location = useLocation();
    const { evaluation } = location.state || {};




    return (
        <div className="body">
            <div className="results-card">
                <div className="results-card-content">
                    <div className="results">
                        <p style={{color:"white", fontWeight: 'bold', fontSize: '20px'}}>Your Grade:</p>
                        <h1 style={{marginLeft: '10px', fontSize: '50px'}}>{evaluation.overall_percentage_grade}%</h1>
                    </div>
                    
                    <div className="glass-line"></div>
                    <div>
                        <div style={{gap: '495px'}} className="title-and-grade">
                            <h1>Clarity: </h1>
                            <h1 style={{color: "white", fontSize: '30px'}}> {evaluation.clarity_score}</h1>
                        </div>
                        <div style={{gap: '465px', fontSize: '40px'}} className="title-and-grade">
                            <h1>Structure: </h1>
                            <h1 style={{color: "white", fontSize: '30px'}}> {evaluation.structure_score}</h1>
                        </div>
                        <div style={{gap: '450px'}} className="title-and-grade">
                            <h1>Relevance: </h1>
                            <h1 style={{color: "white", fontSize: '30px'}}> {evaluation.relevance_score}</h1>
                        </div>
                        <div style={{gap: '432px'}} className="title-and-grade">
                            <h1 style={{color: '#fffeb1'}}>Filler Words: </h1>
                            <h1 style={{color: "#fffeb1", fontSize: '30px'}}> {evaluation.filler_words.count}</h1>
                        </div>  
                        <p style={{color: "white", fontSize: '15px', marginTop: '-20px', marginLeft: '-500px'}}>"{evaluation.filler_words.examples}"</p>

                                      
                        
                    </div>
                    <div className="glass-line"></div>
                    <p style={{color: '#6bb4fd', fontWeight: "bold",fontSize:'20px', marginLeft: '-540px', marginTop: '20px'}}>Comments: </p>
                    <p style={{color: '#ffffff', fontSize: '16px',margin:'0 auto', width: '600px'}}>{evaluation.improvements}</p>
                    
                    <button style={{marginTop: '10px', width: '200px', height: '50px', borderRadius: '30px', fontSize: '20px', border:'none', marginLeft: '-100px',marginTop: "80px", backgroundColor:'#6bb4fd', color: 'black', position:'fixed'}}>Save Grade</button>      

                </div>

            </div>


        </div>
    );

};

export default Results;