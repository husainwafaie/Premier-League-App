import axios from 'axios';
import { IDdct } from '../utils/images';

const API_URL = 'http://localhost:8000';

export const fetchPlayers = async () => {
    const response = await axios.get(`${API_URL}/players`);
    return response.data;
};

export const getPictureUrl = (id: number) => {
    const pictureId = IDdct[id];
    if (pictureId) {
      return `https://resources.premierleague.com/premierleague/photos/players/250x250/${pictureId}.png`;
    }
    return `${process.env.PUBLIC_URL}/blank.png`;
  };