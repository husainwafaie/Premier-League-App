import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getPictureUrl } from '../services/api';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

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
    return <LoadingWrapper>Loading...</LoadingWrapper>;
  }

  return (
    <PageWrapper>
      <PlayerCard
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PlayerImage
          src={getPictureUrl(playerData.id)}
          alt={`Player ${playerData.name}`}
          width={250}
          height={250}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `${process.env.PUBLIC_URL}/blank.png`;
          }}
        />
        <PlayerName>{playerData.name}</PlayerName>
        <PlayerInfo>
          <InfoItem>
            <Label>Team:</Label>
            <Value>{playerData.team}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Position:</Label>
            <Value>{playerData.position}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Total Points:</Label>
            <Value>{playerData.total_points}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Goals Scored:</Label>
            <Value>{playerData.goals_scored}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Assists:</Label>
            <Value>{playerData.assists}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Clean Sheets:</Label>
            <Value>{playerData.clean_sheets}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Form:</Label>
            <Value>{playerData.form}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Price:</Label>
            <Value>£{(playerData.price / 10).toFixed(1)}m</Value>
          </InfoItem>
          <InfoItem>
            <Label>Selected by:</Label>
            <Value>{playerData.selected_by_percent}%</Value>
          </InfoItem>
        </PlayerInfo>
      </PlayerCard>
    </PageWrapper>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #622c6e 0%, #481e52 100%);
  padding: 2rem;
`;

const PlayerCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const PlayerImage = styled.img`
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 5px solid #fff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const PlayerName = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const PlayerInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  background: #f0f0f0;
  padding: 0.5rem;
  border-radius: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
  display: block;
  margin-bottom: 0.25rem;
`;

const Value = styled.span`
  color: #333;
  font-size: 1.1rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.5rem;
  color: #fff;
  background: linear-gradient(135deg, #622c6e 0%, #481e52 100%);
`;

export default PlayerPage;
