import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
    return <LoadingWrapper>Loading...</LoadingWrapper>;
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
    <PageWrapper>
      <TeamHeader
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TeamLogo
          src={`${process.env.PUBLIC_URL}/${teamNameToFileName.get(teamName)}.png`}
          alt={`${teamName} logo`}
        />
        <TeamName>{formatTeamName(teamName || '')}</TeamName>
      </TeamHeader>
      <PlayerSection>
        {['FWD', 'MID', 'DEF'].map((position, index) => (
          <PositionGroup
            key={position}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PositionTitle>{getFullPositionName(position)}</PositionTitle>
            <PlayerList>
              {teamData[position as keyof TeamData]?.map((player, playerIndex) => (
                <PlayerItem
                  key={player.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayerLink to={`/player/${player.id}`}>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerPoints>{player.total_points} points</PlayerPoints>
                  </PlayerLink>
                </PlayerItem>
              ))}
            </PlayerList>
          </PositionGroup>
        ))}
      </PlayerSection>
    </PageWrapper>
  );
};

// Add this helper function
const getFullPositionName = (position: string) => {
  switch (position) {
    case 'FWD':
      return 'Forwards';
    case 'MID':
      return 'Midfielders';
    case 'DEF':
      return 'Defenders';
    default:
      return position;
  }
};

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #4a1e5a;
  min-height: 100vh;
`;

const TeamHeader = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const TeamLogo = styled.img`
  width: 15%;
  aspect-ratio: 1/1;
  object-fit: contain;
  margin-right: 1rem;
`;

const TeamName = styled.h1`
  font-size: 2.5rem;
  color: #F5F5F5;
`;

const PlayerSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const PositionGroup = styled(motion.div)`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PositionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.5rem;
`;

const PlayerList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PlayerItem = styled(motion.li)`
  margin-bottom: 0.5rem;
`;

const PlayerLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 5px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #eaeaea;
  }
`;

const PlayerName = styled.span`
  font-weight: bold;
`;

const PlayerPoints = styled.span`
  color: #666;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #333;
`;

export default TeamPage;
