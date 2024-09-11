import React, { useEffect, useState } from 'react';
import { fetchPlayers } from '../services/api';
import PlayerCard from './PlayerCard';

const PlayerList = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        fetchPlayers().then(setPlayers);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {players.map((player) => (
                <PlayerCard key={player.name} player={player} />
            ))}
        </div>
    );
};
export default PlayerList;
