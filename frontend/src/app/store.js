import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import questionReducer from "../features/questions/questionSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionReducer,
    },
});
