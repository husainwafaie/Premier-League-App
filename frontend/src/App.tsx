import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import PlayerList from './components/PlayerList';
import Dashboard from './components/Dashboard';
import TeamPage from './components/TeamPage';
import PlayerComparison from './components/PlayerComparison';
import TopPerformers from './components/TopPerformers';
import TransferMarket from './components/TransferMarket';
import InjuryTracker from './components/InjuryTracker';
import PlayerPage from './components/PlayerPage';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="App-content">
          <nav className="App-nav">
            <div className="logo">
              PL Stats
            </div>
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
                <div className="welcome-page">
                  <h1 className="welcome-title">Welcome to Premier League Stats Tracker</h1>
                  <img className="welcome-logo" src={process.env.PUBLIC_URL + '/pl.png'} alt="Premier League Logo" />
                  <p className="welcome-subtitle">Explore player statistics, compare performances, and stay updated with the latest Premier League insights.</p>
                  <div className="welcome-features">
                    <div className="feature">
                      <i className="fas fa-chart-line"></i>
                      <h3>Player Statistics</h3>
                    </div>
                    <div className="feature">
                      <i className="fas fa-users"></i>
                      <h3>Team Comparisons</h3>
                    </div>
                    <div className="feature">
                      <i className="fas fa-trophy"></i>
                      <h3>Top Performers</h3>
                    </div>
                  </div>
                  <Link to="/dashboard" className="cta-button">Get Started</Link>
                </div>
              } />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teams/:teamName" element={<TeamPage />} />
              <Route path="/player-comparison" element={<PlayerComparison />} />
              <Route path="/top-performers" element={<TopPerformers />} />
              <Route path="/transfer-market" element={<TransferMarket />} />
              <Route path="/injury-tracker" element={<InjuryTracker />} />
              <Route path="/player/:playerId" element={<PlayerPage />} />
              {/* Add other routes as needed */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
