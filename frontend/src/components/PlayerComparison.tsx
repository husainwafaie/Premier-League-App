import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Link } from 'react-router-dom';
import '../App.css';

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
        
        // Exclude the first selected player from the results
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
          // Use player names instead of IDs
          const [player1Data, player2Data] = await Promise.all([
            axios.get(`http://localhost:8000/players/search/?query=${encodeURIComponent(selectedPlayers[0].name)}&position=${selectedPosition}`),
            axios.get(`http://localhost:8000/players/search/?query=${encodeURIComponent(selectedPlayers[1].name)}&position=${selectedPosition}`)
          ]);

          // Assuming the search returns an array, we take the first result
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

  const renderComparisonData = () => {
    return (
      <div className="comparison-data">
        {selectedPlayers.map((player, index) => (
          <div key={player.name} className="player-column">
            <h3>
              <Link to={`/player/${player.id}`}>{player.name}</Link>
            </h3>
            {comparisonData[index] ? (
              <>
                <p>Team: {comparisonData[index].team}</p>
                <p>Position: {comparisonData[index].position}</p>
                <p>Total Points: {comparisonData[index].total_points}</p>
                {/* Add more player statistics here */}
              </>
            ) : (
              <p>Loading...</p>
            )}
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
          <React.Fragment key={position}>
            <button onClick={() => handlePositionSelect(position)}>
              {position}
            </button>
            <br />
          </React.Fragment>
        ))}
      </div>
      )}
      {selectedPosition && (
        <div className="player-selection">
          <h3>Select {selectedPlayers.length === 1 ? 'second' : 'first'} {selectedPosition}s to compare:</h3>
          <div className="autocomplete">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder={`Search for ${selectedPosition}s`}
              style={{ color: 'black' }}
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
      {selectedPlayers.length > 0 && renderComparisonData()}
    </div>
  );
};

export default PlayerComparison;
