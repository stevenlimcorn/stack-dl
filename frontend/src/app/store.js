import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import questionReducer from "../features/questions/questionSlice";
import answerReducer from "../features/answers/answerSlice";
import bookmarkReducer from "../features/bookmarks/bookmarkSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionReducer,
        answers: answerReducer,
        bookmarks: bookmarkReducer,
    },
});
