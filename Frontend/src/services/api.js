import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Change to your deployed URL later
});

// Automatically add JWT token to every request if it exists
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

export default API;