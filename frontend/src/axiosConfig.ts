import axios from 'axios';

export const getAxiosInstance = (timeout: number = 10000, contentType: string = 'application/json') => {
    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
        headers: {
            'Content-Type': contentType
        },
        withCredentials: true,
        timeout
    });

    return axiosInstance;
}
