import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

const PlayerComparison: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
    setSelectedPlayers([]);
    setSearchResults([]);
    setSearchQuery('');
    setComparisonData([]);
  };

  const handlePlayerSelect = (player: any) => {
    if (selectedPlayers.some(p => p.name === player.name)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.name !== player.name));
    } else if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/players/search/?query=${query}&position=${selectedPosition}`);
        let results = response.data;
        
        if (selectedPlayers.length === 1) {
          results = results.filter((player: any) => player.name !== selectedPlayers[0].name);
        }
        
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching players:', error);
      }
    }, 300),
    [selectedPosition, selectedPlayers]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (selectedPlayers.length === 2) {
        try {
          const [player1Data, player2Data] = await Promise.all([
            axios.get(`http://localhost:8000/players/search/?query=${encodeURIComponent(selectedPlayers[0].name)}&position=${selectedPosition}`),
            axios.get(`http://localhost:8000/players/search/?query=${encodeURIComponent(selectedPlayers[1].name)}&position=${selectedPosition}`)
          ]);

          setComparisonData([player1Data.data[0], player2Data.data[0]]);
        } catch (error) {
          console.error('Error fetching comparison data:', error);
        }
      } else {
        setComparisonData([]);
      }
    };

    fetchComparisonData();
  }, [selectedPlayers, selectedPosition]);

  const handleNewComparison = () => {
    setSelectedPosition(null);
    setSelectedPlayers([]);
    setSearchQuery('');
    setSearchResults([]);
    setComparisonData([]);
  };

  const renderPlayerStats = (player: any) => {
    const commonStats = [
      { label: 'Team', value: player.team },
      { label: 'Cost', value: `£${player.cost}m` },
      { label: 'Total Points', value: player.total_points },
      { label: 'Points per Game', value: player.points_per_game },
    ];

    let positionSpecificStats: { label: string; value: any }[] = [];

    if (player.position === 'FWD' || player.position === 'MID') {
      positionSpecificStats = [
        { label: 'Goals', value: player.goals_scored },
        { label: 'Assists', value: player.assists },
        { label: 'Form', value: player.form },
      ];
    } else if (player.position === 'DEF') {
      positionSpecificStats = [
        { label: 'Clean Sheets', value: player.clean_sheets },
        { label: 'Form', value: player.form },
        { label: 'Starts', value: player.starts },
      ];
    } else if (player.position === 'GKP') {
      positionSpecificStats = [
        { label: 'Clean Sheets', value: player.clean_sheets },
        { label: 'Saves', value: player.saves },
        { label: 'Penalties Saved', value: player.penalties_saved },
      ];
    }

    return [...commonStats, ...positionSpecificStats];
  };

  return (
    <ComparisonWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Player Comparison</Title>
      {!selectedPosition && (
        <PositionSelection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Select a position:</h3>
          <PositionButtons>
            {positions.map((position, index) => (
              <PositionButton
                key={position}
                onClick={() => handlePositionSelect(position)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {position}
              </PositionButton>
            ))}
          </PositionButtons>
        </PositionSelection>
      )}
      {selectedPosition && selectedPlayers.length < 2 && (
        <PlayerSelection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Select {selectedPlayers.length === 1 ? 'second' : 'first'} {selectedPosition} to compare:</h3>
          <AutocompleteWrapper>
            <SearchInput
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder={`Search for ${selectedPosition}s`}
            />
            <AnimatePresence>
              {searchResults.length > 0 && (
                <AutocompleteResults
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {searchResults.map((player, index) => (
                    <AutocompleteItem
                      key={player.name}
                      onClick={() => handlePlayerSelect(player)}
                      className={selectedPlayers.some(p => p.name === player.name) ? 'selected' : ''}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {player.name} ({player.team})
                    </AutocompleteItem>
                  ))}
                </AutocompleteResults>
              )}
            </AnimatePresence>
          </AutocompleteWrapper>
        </PlayerSelection>
      )}
      {selectedPlayers.length > 0 && (
        <ComparisonData
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {selectedPlayers.map((player, index) => (
            <PlayerColumn
              key={player.name}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <h3>
                <PlayerLink to={`/player/${player.id}`}>{player.name}</PlayerLink>
              </h3>
              {comparisonData[index] ? (
                <PlayerStats>
                  {renderPlayerStats(comparisonData[index]).map((stat, statIndex) => (
                    <StatItem key={statIndex}>
                      <StatLabel>{stat.label}:</StatLabel>
                      <StatValue>{stat.value}</StatValue>
                    </StatItem>
                  ))}
                </PlayerStats>
              ) : (
                <LoadingText>Loading...</LoadingText>
              )}
            </PlayerColumn>
          ))}
        </ComparisonData>
      )}
      {selectedPlayers.length === 2 && (
        <NewComparisonButton
          onClick={handleNewComparison}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          New Comparison
        </NewComparisonButton>
      )}
    </ComparisonWrapper>
  );
};

const ComparisonWrapper = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--white);
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: var(--new-purple);
  text-align: center;
  margin-bottom: 2rem;
`;

const PositionSelection = styled(motion.div)`
  text-align: center;
  margin-bottom: 2rem;
`;

const PositionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const PositionButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background-color: var(--light-purple);
  color: var(--white);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--pl-purple);
  }
`;

const PlayerSelection = styled(motion.div)`
  margin-bottom: 2rem;
`;

const AutocompleteWrapper = styled.div`
  position: relative;
  max-width: 400px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  color: var(--white);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const AutocompleteResults = styled(motion.ul)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--light-purple);
  border-radius: 0 0 5px 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
`;

const AutocompleteItem = styled(motion.li)`
  padding: 0.75rem;
  cursor: pointer;

  &.selected {
    background-color: var(--pl-purple);
  }
`;

const ComparisonData = styled(motion.div)`
  display: flex;
  justify-content: space-around;
  gap: 2rem;
`;

const PlayerColumn = styled(motion.div)`
  flex: 1;
  background-color: var(--light-purple);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PlayerLink = styled(Link)`
  color: var(--new-purple);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  transition: color 0.3s ease;

  &:hover {
    color: var(--white);
  }
`;

const PlayerStats = styled.div`
  margin-top: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  font-size: 1.1rem;
`;

const StatLabel = styled.span`
  font-weight: bold;
`;

const StatValue = styled.span`
  color: var(--new-purple);
`;

const LoadingText = styled.p`
  text-align: center;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
`;

const NewComparisonButton = styled(motion.button)`
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 1.5rem;
  background-color: var(--new-purple);
  color: var(--white);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--pl-purple);
  }
`;

export default PlayerComparison;
