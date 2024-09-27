import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import '../App.css';

const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

const PlayerComparison: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handlePositionSelect = (position: string) => {
    setSelectedPosition(position);
    setSelectedPlayers([]);
    setSearchResults([]);
    setSearchQuery('');
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
        const response = await axios.get(`/api/players/search/?query=${query}&position=${selectedPosition}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching players:', error);
      }
    }, 300),
    [selectedPosition]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const renderComparisonData = () => {
    return (
      <div className="comparison-data">
        {selectedPlayers.map(player => (
          <div key={player.name} className="player-column">
            <h3>{player.name}</h3>
            <p>Team: {player.team}</p>
            <p>Position: {player.position}</p>
            <p>Total Points: {player.total_points}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="player-comparison">
      <h2>Player Comparison</h2>
      {!selectedPosition && (
        <div className="position-selection">
          <h3>Select a position:</h3>
          {positions.map(position => (
            <button key={position} onClick={() => handlePositionSelect(position)}>
              {position}
            </button>
          ))}
        </div>
      )}
      {selectedPosition && (
        <div className="player-selection">
          <h3>Select two {selectedPosition}s to compare:</h3>
          <div className="autocomplete">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder={`Search for ${selectedPosition}s`}
            />
            {searchResults.length > 0 && (
              <ul className="autocomplete-results">
                {searchResults.map(player => (
                  <li
                    key={player.name}
                    onClick={() => handlePlayerSelect(player)}
                    className={selectedPlayers.some(p => p.name === player.name) ? 'selected' : ''}
                  >
                    {player.name} ({player.team})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {selectedPlayers.length === 2 && renderComparisonData()}
    </div>
  );
};

export default PlayerComparison;
