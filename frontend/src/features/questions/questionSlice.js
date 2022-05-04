import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import questionService from "./questionService";

const initialState = {
    questions: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// create user questions
export const createQuestion = createAsyncThunk(
    "questions/create",
    async (questionData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await questionService.createQuestion(questionData, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// get user questions
export const getAllQuestions = createAsyncThunk(
    "questions/getQuestions",
    async (_, thunkAPI) => {
        try {
            return await questionService.getAllQuestions();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getQuestionsByUserId = createAsyncThunk(
    "questions/getQuestionsById",
    async (id, thunkAPI) => {
        try {
            return await questionService.getQuestionsByUserId(id);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// get user questions
export const deleteQuestion = createAsyncThunk(
    "questions/deleteQuestion",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await questionService.deleteQuestion(id, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const questionSlice = createSlice({
    name: "question",
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions.push(action.payload);
            })
            .addCase(createQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getQuestionsByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getQuestionsByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions = action.payload;
            })
            .addCase(getQuestionsByUserId.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllQuestions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllQuestions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions = action.payload;
            })
            .addCase(getAllQuestions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.questions = state.questions.filter(
                    (x) => x._id !== action.payload.id
                );
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = questionSlice.actions;
export default questionSlice.reducer;
