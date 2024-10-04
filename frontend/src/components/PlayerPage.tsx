import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface PlayerData {
  id: number;
  name: string;
  team: string;
  position: string;
  total_points: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  form: string;
  price: number;
  selected_by_percent: number;
}

const PlayerPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/player/${playerId}`);
        setPlayerData(response.data);
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  if (!playerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="player-page">
      <h2>{playerData.name}</h2>
      <div className="player-info">
        <p>Team: {playerData.team}</p>
        <p>Position: {playerData.position}</p>
        <p>Total Points: {playerData.total_points}</p>
        <p>Goals Scored: {playerData.goals_scored}</p>
        <p>Assists: {playerData.assists}</p>
        <p>Clean Sheets: {playerData.clean_sheets}</p>
        <p>Form: {playerData.form}</p>
        <p>Price: £{(playerData.price / 10).toFixed(1)}m</p>
        <p>Selected by: {playerData.selected_by_percent}%</p>
      </div>
    </div>
  );
};

export default PlayerPage;