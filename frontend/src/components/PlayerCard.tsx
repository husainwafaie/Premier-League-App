const PlayerCard = ({ player }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold">{player.name}</h2>
            <p>Goals: {player.goals}</p>
            <p>Assists: {player.assists}</p>
        </div>
    );
};
export default PlayerCard;
