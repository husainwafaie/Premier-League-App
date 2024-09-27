import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from 'react-router-dom';
interface TopPlayer {
  name: string;
  total_points: number;
}

const Dashboard: React.FC = () => {
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/dashboard');
        // The response.data is already the array of top players
        setTopPlayers(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const teamLogos = [
    { name: 'Arsenal', file: 'arsenal.png' },
    { name: 'Aston Villa', file: 'astonvilla.png' },
    { name: 'Bournemouth', file: 'bournemouth.png' },
    { name: 'Brentford', file: 'brentford.png' },
    { name: 'Brighton', file: 'brighton.png' },
    { name: 'Chelsea', file: 'chelsea.png' },
    { name: 'Crystal Palace', file: 'crystal.png' },
    { name: 'Everton', file: 'everton.png' },
    { name: 'Fulham', file: 'fulham.png' },
    { name: 'Ipswich', file: 'ipswich.png' },
    { name: 'Leicester', file: 'leicester.png' },
    { name: 'Liverpool', file: 'liverpool.png' },
    { name: 'Man City', file: 'city.png' },
    { name: 'Man Utd', file: 'manunited.png' },
    { name: 'Newcastle', file: 'newcastle.png' },
    { name: "Nott'm Forest", file: 'nott.png' },
    { name: 'Southampton', file: 'southampton.png' },
    { name: 'Spurs', file: 'spurs.png' },
    { name: 'West Ham', file: 'westham.png' },
    { name: 'Wolves', file: 'wolves.png' },
  ];

  const handleLogoClick = (teamName: string) => {
    // Replace this with the actual URL you want to navigate to
    const url = `https://example.com/team/${teamName.replace(' ', '-')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="top-players">
        <h3>Top 3 Players</h3>
        <ul>
          {topPlayers.map((player, index) => (
            <li key={index}>
              {player.name} - {player.total_points} points
            </li>
          ))}
        </ul>
      </div>
      <div className="team-logos">
        <h3>Premier League Teams</h3>
        <div className="logo-grid">
          {teamLogos.map((team, index) => (
            <div key={index} className="logo-item">
              <Link 
                to={`/teams/${team.name.replace(/ /g, '-')}`}
                className="logo-wrapper"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/${team.file}`}
                  alt={team.name}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;