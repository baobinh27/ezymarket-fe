import axios from 'axios';
import Constants from 'expo-constants';
// import fetchAdapter from "@vespaiach/axios-fetch-adapter";

type Extra = {
    BASE_API: string;
};

const { BASE_API } = Constants.expoConfig?.extra as Extra;

const axiosInstance = axios.create({
    baseURL: BASE_API,
    // timeout: 5000,
    // timeoutErrorMessage: "Timed out. Please try again later."
    headers: {
        'Content-Type': 'application/json',
    },
})

export default axiosInstance;