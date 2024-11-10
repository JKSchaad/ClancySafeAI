import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'https://localhost:44339', // Your API URL
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api; 