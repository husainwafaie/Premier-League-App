import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface InjuredPlayer {
  name: string;
  id: number;
  team: string;
  position: string;
  total_points: number;
  news: string;
  chance_of_playing_next_round: number | null;
}

const InjuryTracker: React.FC = () => {
  const [injuredPlayers, setInjuredPlayers] = useState<InjuredPlayer[]>([]);

  useEffect(() => {
    const fetchInjuredPlayers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/injury-tracker/');
        setInjuredPlayers(response.data);
      } catch (error) {
        console.error('Error fetching injured players:', error);
      }
    };

    fetchInjuredPlayers();
  }, []);

  return (
    <div className="injury-tracker">
      <h2>Injury Tracker</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th>
            <th>Total Pts</th>
            <th>Status</th>
            <th>Chance of Playing</th>
          </tr>
        </thead>
        <tbody>
          {injuredPlayers.map((player, index) => (
            <tr key={index}>
              <td>
                <Link to={`/player/${player.id}`}>{player.name}</Link>
              </td>
              <td>{player.team}</td>
              <td>{player.position}</td>
              <td>{player.total_points}</td>
              <td>{player.news}</td>
              <td>
                {player.chance_of_playing_next_round !== null
                  ? `${player.chance_of_playing_next_round}%`
                  : 'Unknown'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InjuryTracker;