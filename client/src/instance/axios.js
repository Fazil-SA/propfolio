import axios from 'axios'

export const axiosInstance = axios.create({
    // baseURL: 'http://localhost:3000'
    baseURL: import.meta.env.RENDER_URL
})