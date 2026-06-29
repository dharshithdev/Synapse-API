import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

// Add a response interceptor
api.interceptors.response.use(
    (response) => response, // If the request is successful, do nothing
    (error) => {
        // Check if the server returned 401 (Unauthorized) 
        // and if the message is about the token expiring
        if (error.response && error.response.status === 401) {
            console.log("Token expired or invalid. Redirecting...");
            
            // 1. Clear the local storage
            localStorage.clear();
            
            // 2. Redirect to login
            window.location.href = '/verify';
        }
        return Promise.reject(error);
    }
);

export default api;