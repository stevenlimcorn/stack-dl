import axios from "axios";

const API_URL = "/api/bookmarks/";

// Create new question
const bookmarkQuestion = async (payload, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, payload, config);
    return response.data;
};

const getBookmark = async (id) => {
    const response = await axios.get(API_URL + `${id}`);
    return response.data;
};

const bookmarkService = {
    getBookmark,
    bookmarkQuestion,
};

export default bookmarkService;
