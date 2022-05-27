import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookmarkService from "./bookmarkService";

const initialState = {
    bookmarks: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const bookmarkQuestion = createAsyncThunk(
    "bookmarks/bookmarkQuestion",
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await bookmarkService.bookmarkQuestion(payload, token);
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
export const getBookmark = createAsyncThunk(
    "bookmarks/getBookmark",
    async (id, thunkAPI) => {
        try {
            return await bookmarkService.getBookmark(id);
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

export const bookmarkSlice = createSlice({
    name: "bookmarks",
    initialState,
    reducers: {
        bookmarkReset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(bookmarkQuestion.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(bookmarkQuestion.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bookmarks = action.payload;
            })
            .addCase(bookmarkQuestion.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getBookmark.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBookmark.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.bookmarks = action.payload;
            })
            .addCase(getBookmark.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { bookmarkReset } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
