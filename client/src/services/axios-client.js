import axios from 'axios'
const PORT = import.meta.env.VITE_PORT

const baseURL = `http://localhost:${PORT}/api`

const apiClient = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

export default apiClient