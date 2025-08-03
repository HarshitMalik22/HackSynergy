import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getUserProfile = async () => {
    try {
        const {data} = await api.get("/user/profile");
        return data.data;
    }catch(err){
        console.error("Error fetching profile:", error);
        throw error;
    }
};
