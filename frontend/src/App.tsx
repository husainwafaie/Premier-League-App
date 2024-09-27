import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import PlayerList from './components/PlayerList';
import Dashboard from './components/Dashboard';
import TeamPage from './components/TeamPage';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="App-content">
          <nav className="App-nav">
            <div className="logo">PL Stats</div>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/player-comparison">Player Comparison</Link></li>
              <li><Link to="/top-performers">Top Performers</Link></li>
              <li><Link to="/transfer-market">Transfer Market</Link></li>
              <li><Link to="/injury-tracker">Injury Tracker</Link></li>
            </ul>
          </nav>
          <main className="App-main">
            <Routes>
              <Route path="/" element={
                <>
                  <h1>Welcome to Premier League Stats Tracker</h1>
                  <img src={process.env.PUBLIC_URL + '/pl.png'} alt="Premier League Logo" />
                  <p className="subtitle">Explore player statistics, compare performances, and stay updated with the latest Premier League insights.</p>
                  <PlayerList />
                </>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teams/:teamName" element={<TeamPage />} />
              {/* Add other routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
