// PlayerCard.tsx
import React from 'react';
import { Player } from '../types'; // Adjust the import path based on where you define your types

interface PlayerCardProps {
    player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
    return (
        <div>
            <h3>{player.name}</h3>
            <p>Position: {player.position}</p>
            <p>Team: {player.team}</p>
            <p>Points per Game: {player.points_per_game.toFixed(2)}</p>
        </div>
    );
};

export default PlayerCard;

