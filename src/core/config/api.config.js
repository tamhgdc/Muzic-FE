import axios from "axios";

const axiosConfig =  axios.create({
    baseURL: process.env.REACT_APP_URL_BE
})

export default axiosConfig;