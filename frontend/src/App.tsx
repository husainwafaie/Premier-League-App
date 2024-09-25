// src/App.tsx
import React from 'react';
import './App.css';
import PlayerList from './components/PlayerList';  // Ensure the path matches your file structure

// - player statistics dashboard
// - player comparison
// - top performers and trends
// - transfer market insights (players transferred in/out the most and most popularity)
// - player injury and suspension tracker


function App() {
  return (
    <div className="App">
      <div className="App-content">
        <nav className="App-nav">
          <div className="logo">PL Stats</div>
          <ul>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#player-comparison">Player Comparison</a></li>
            <li><a href="#top-performers">Top Performers</a></li>
            <li><a href="#transfer-market">Transfer Market</a></li>
            <li><a href="#injury-tracker">Injury Tracker</a></li>
          </ul>
        </nav>
        <main className="App-main">
          <h1>Welcome to Premier League Stats Tracker</h1>
          <p className="subtitle">Explore player statistics, compare performances, and stay updated with the latest Premier League insights.</p>
          
        </main>
      </div>
    </div>
  );
}

export default App;
