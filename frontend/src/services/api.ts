import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const fetchPlayers = async () => {
    const response = await axios.get(`${API_URL}/players`);
    return response.data;
};
