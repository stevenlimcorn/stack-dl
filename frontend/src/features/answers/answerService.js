import axios from "axios";

const API_URL = "/api/answers/";

// Create new question
const createAnswer = async (answerData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, answerData, config);
    return response.data;
};

const getAnswerByQuestionId = async (questionId) => {
    const response = await axios.get(API_URL + `${questionId}`);
    return response.data;
};

const like = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(
        API_URL + `like/${payload.id}`,
        { like: payload.value },
        config
    );
    return response.data;
};

const answerService = {
    createAnswer,
    getAnswerByQuestionId,
    like,
};

export default answerService;
