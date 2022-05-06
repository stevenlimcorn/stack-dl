import axios from "axios";

const API_URL = "/api/questions/";

// Create new question
const createQuestion = async (questionData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, questionData, config);
    return response.data;
};

// Get user question question
const getAllQuestions = async () => {
    const response = await axios.get(API_URL + "all");
    return response.data;
};

// Get user question question
const getQuestionsByUserId = async (id) => {
    const response = await axios.get(API_URL + `user/${id}`);
    return response.data;
};

// Get user question question
const getQuestionById = async (id) => {
    const response = await axios.get(API_URL + `/${id}`);
    return response.data;
};

// Delete user question question
const deleteQuestion = async (questionId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + questionId, config);
    return response.data;
};

const questionService = {
    createQuestion,
    deleteQuestion,
    getAllQuestions,
    getQuestionsByUserId,
    getQuestionById,
};

export default questionService;
