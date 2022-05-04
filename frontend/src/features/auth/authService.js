import axios from "axios";
const API_URL = "/api/users/";

// login user
// reigster user
const login = async (userData) => {
    const response = await axios.post(API_URL + "login", userData);
    if (response.data) {
        sessionStorage.setItem("token", JSON.stringify(response.data));
    }
    return response.data;
};

// reigster user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData);
    if (response.data) {
        sessionStorage.setItem("token", JSON.stringify(response.data));
    }
    return response.data;
};

const getUser = async (id) => {
    const response = await axios.get(API_URL + `user/${id}`);
    return response.data;
};

const logout = async () => {
    await axios.get(API_URL + "logout");
    sessionStorage.removeItem("token");
};

// request password reset
const forgotPassword = async (userData) => {
    const response = await axios.post(
        API_URL + "requestPasswordReset",
        userData
    );
    return response.data;
};

const authService = {
    register,
    logout,
    login,
    forgotPassword,
    getUser,
};

export default authService;
