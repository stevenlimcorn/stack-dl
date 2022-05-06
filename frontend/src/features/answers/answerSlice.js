import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import answerService from "./answerService";

const initialState = {
    answers: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// payload consist of {id, answerData}
export const createAnswer = createAsyncThunk(
    "answers/createAnswer",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await answerService.createAnswer(payload, token);
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

// payload consist of {id, answerData}
export const getAnswerByQuestionId = createAsyncThunk(
    "answers/getAnswerByQuestionId",
    async (questionId, thunkAPI) => {
        try {
            return await answerService.getAnswerByQuestionId(questionId);
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

export const like = createAsyncThunk(
    "answers/like",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await answerService.like(payload, token);
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

export const answerSlice = createSlice({
    name: "answer",
    initialState,
    reducers: {
        answerReset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAnswer.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createAnswer.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.answers.push(action.payload);
            })
            .addCase(createAnswer.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAnswerByQuestionId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAnswerByQuestionId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                if (action.payload.length > 0) {
                    state.answers = action.payload;
                }
            })
            .addCase(getAnswerByQuestionId.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(like.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.answers.map((obj) => {
                    if (action.payload._id === obj.id) {
                        return action.payload;
                    } else {
                        return obj;
                    }
                });
            })
            .addCase(like.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { answerReset } = answerSlice.actions;
export default answerSlice.reducer;
