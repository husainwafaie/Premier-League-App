import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Player {
  name: string;
  team: string;
  position: string;
  points_per_game: number;
  total_points: number;
  selected_by_percent: number;
}

const TopPerformers: React.FC = () => {
  const [topPerformers, setTopPerformers] = useState<Record<string, Player[]>>({});

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/top-performers/');
        setTopPerformers(response.data);
      } catch (error) {
        console.error('Error fetching top performers:', error);
      }
    };

    fetchTopPerformers();
  }, []);

  const positionNames = {
    FWD: 'Forwards',
    MID: 'Midfielders',
    DEF: 'Defenders',
    GKP: 'Goalkeepers'
  };

  return (
    <div className="top-performers">
      <h1>Top Performers</h1>
      {Object.entries(topPerformers).map(([position, players]) => (
        <div key={position} className="position-group">
          <h2>{positionNames[position as keyof typeof positionNames]}</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Team</th>
                <th>Points per Game</th>
                <th>Total Points</th>
                <th>Selected By</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  <td>{player.name}</td>
                  <td>{player.team}</td>
                  <td>{player.points_per_game.toFixed(1)}</td>
                  <td>{player.total_points}</td>
                  <td>{player.selected_by_percent.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default TopPerformers;