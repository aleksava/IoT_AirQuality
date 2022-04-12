import axios from 'axios';
import SecureStore from '../utils/secureStore';

const apiClient = axios.create({
    baseURL: process.env.API_URL
});

apiClient.interceptors.request.use((config) => {
    // const accessToken = SecureStore.getItem('accessToken');
    const accessToken = process.env.BEARER_TOKEN;

    if (accessToken) {
        config.headers!['Authorization'] = 'Bearer ' + accessToken;
    }

    return config;
});

apiClient.interceptors.response.use(
    (res) => {
        return res;
    },
    (err) => {
        console.log(err);

        const originalConfig = err.config;

        if (err.config && err.response && err.response.status === 401) {
            // Unauthenticated - delete access token and set isSignedIn to false
        }

        return err.config;
    }
);

export default apiClient;
