import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Player {
  name: string;
  id: number;
  team: string;
  position: string;
  selected_by_percent?: number;
  transfers_in_event?: number;
  transfers_out_event?: number;
}

interface TransferMarketData {
  highest_owned: Player[];
  most_transferred_in: Player[];
  most_transferred_out: Player[];
}

const TransferMarket: React.FC = () => {
  const [transferMarketData, setTransferMarketData] = useState<TransferMarketData | null>(null);

  useEffect(() => {
    const fetchTransferMarketData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/transfer-market/');
        setTransferMarketData(response.data);
      } catch (error) {
        console.error('Error fetching transfer market data:', error);
      }
    };

    fetchTransferMarketData();
  }, []);

  const renderPlayerList = (players: Player[], title: string, dataKey: string) => (
    <div className="player-list">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th>
            <th>{dataKey === 'selected_by_percent' ? 'Ownership' : 'Transfers'}</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>
                <Link to={`/player/${player.id}`}>{player.name}</Link>
              </td>
              <td>{player.team}</td>
              <td>{player.position}</td>
              <td>
                {dataKey === 'selected_by_percent'
                  ? `${player.selected_by_percent?.toFixed(1)}%`
                  : player[dataKey as keyof Player]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!transferMarketData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="transfer-market">
      <h2>Transfer Market</h2>
      {renderPlayerList(transferMarketData.highest_owned, 'Highest Owned Players', 'selected_by_percent')}
      {renderPlayerList(transferMarketData.most_transferred_in, 'Most Transferred In', 'transfers_in_event')}
      {renderPlayerList(transferMarketData.most_transferred_out, 'Most Transferred Out', 'transfers_out_event')}
    </div>
  );
};

export default TransferMarket;
