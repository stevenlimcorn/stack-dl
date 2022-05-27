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
    return response.data;
};

// activate  user
const activate = async (token) => {
    const activation_token = {
        activation_token: token,
    };
    const response = await axios.post(API_URL + "activation", activation_token);
    return response.data;
};

const getUser = async (id) => {
    const response = await axios.get(API_URL + `user/${id}`);
    return response.data;
};

const updateUser = async (data, token, id) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + `user/${id}`, data, config);
    return response.data;
};

const logout = async () => {
    await axios.get(API_URL + "logout");
    sessionStorage.removeItem("token");
};

// request password reset
const forgotPassword = async (email) => {
    const response = await axios.post(API_URL + "forgot_password", email);
    return response.data;
};

// request password reset
const resetPassword = async (password, token) => {
    const response = await axios.post(
        API_URL + "reset_password",
        { password: password },
        {
            headers: { Authorization: token },
        }
    );
    return response.data;
};

const authService = {
    register,
    logout,
    login,
    forgotPassword,
    getUser,
    updateUser,
    activate,
    resetPassword,
};

export default authService;
