import './App.css';
import { FaArrowUp } from "react-icons/fa";
import LiquidEther from './background';

function App() {
  return (
    <div className="App">
      {/* LiquidEther background */}
      <div className="liquid-ether-container">
        <LiquidEther
          style={{ width: '100%', height: '100%' }}  // important!
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <header className="App-header">
        <h1>FlowState</h1>

        <div className="wrapper">
          <input type="text" className="input" placeholder="Type here..." />
          <button className="button"><FaArrowUp /></button>
          <button className="secondary-button">+</button>
        </div>
      </header>
    </div>
  );
}

export default App;
