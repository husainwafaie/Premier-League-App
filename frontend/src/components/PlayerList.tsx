// PlayerList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from './PlayerCard';
import { Player } from '../types';  // Adjust the import path to where you define your types

const PlayerList: React.FC = () => {
    // Declare the type of state as an array of Player
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const result = await axios('http://localhost:8000/players');
                setPlayers(result.data); // Assuming the data is directly an array of Player objects
            } catch (error) {
                console.error('Failed to fetch players:', error);
            }
        };
        fetchPlayers();
    }, []);

    return (
        <div>
            {players.length > 0 ? (
                players.map(player => (
                    <PlayerCard key={player.id} player={player} />
                ))
            ) : (
                <p>Loading players...</p>
            )}
        </div>
    );
};

export default PlayerList;
