// PlayerList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlayerCard from './PlayerCard';
import { Player } from '../types';

const PlayerList: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const result = await axios('http://localhost:8000/players');
                setPlayers(result.data);
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
