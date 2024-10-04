import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Player {
  name: string;
  position: string;
  total_points: number;
  id: number;
}

interface TeamData {
  FWD: Player[];
  MID: Player[];
  DEF: Player[];
}

const TeamPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [teamData, setTeamData] = useState<TeamData | null>(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/teams/${teamName}`);
        setTeamData(response.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamData();
  }, [teamName]);

  const formatTeamName = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const renderPlayerList = (players: Player[], position: string) => (
    <div className="player-list">
      <h3>{position}</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            <Link to={`/player/${player.id}`}>{player.name}</Link> - {player.total_points} points
          </li>
        ))}
      </ul>
    </div>
  );

  if (!teamData) {
    return <div>Loading...</div>;
  }

  const teamNameToFileName = new Map([
    ['Arsenal', 'arsenal'],
    ['Aston-Villa', 'astonvilla'],
    ['Bournemouth', 'bournemouth'],
    ['Brentford', 'brentford'],
    ['Brighton', 'brighton'],
    ['Chelsea', 'chelsea'],
    ['Crystal-Palace', 'crystal'],
    ['Everton', 'everton'],
    ['Fulham', 'fulham'],
    ['Leicester', 'leicester'],
    ['Liverpool', 'liverpool'],
    ['Man-City', 'city'],
    ['Man-Utd', 'manunited'],
    ['Newcastle', 'newcastle'],
    ["Nott'm-Forest", 'nott'],
    ['Southampton', 'southampton'],
    ['Spurs', 'spurs'],
    ['West-Ham', 'westham'],
    ['Wolves', 'wolves'],
    [undefined, "none"]
  ]);

  return (
    <div className="team-page">
      <h2>{formatTeamName(teamName || '')}</h2>
      <div className="team-logo">
        <img
          src={`${process.env.PUBLIC_URL}/${teamNameToFileName.get(teamName)}.png`}
          alt={`${teamName} logo`}
        />
      </div>
      <div className="top-players">
        {renderPlayerList(teamData.FWD, 'Forwards')}
        {renderPlayerList(teamData.MID, 'Midfielders')}
        {renderPlayerList(teamData.DEF, 'Defenders')}
      </div>
    </div>
  );
};

export default TeamPage;
