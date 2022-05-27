import { Box } from "@mui/system";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import QuestionItem from "../components/QuestionItem";
import Spinner from "../components/Spinner";
import { authReset } from "../features/auth/authSlice";
import {
    getBookmark,
    bookmarkReset,
    bookmarkQuestion,
} from "../features/bookmarks/bookmarkSlice";
import DeleteIcon from "@mui/icons-material/Delete";

function Bookmarks() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { bookmarks, isLoading, isError, message } = useSelector(
        (state) => state.bookmarks
    );

    function storeScrollPosition() {
        sessionStorage.setItem("bookmarkScrollPosition", window.pageYOffset);
    }

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        setTimeout(() => {
            if (sessionStorage.getItem("bookmarkScrollPosition")) {
                const scrollPosition = sessionStorage.getItem(
                    "bookmarkScrollPosition"
                );
                window.scrollTo(0, parseInt(scrollPosition));
                sessionStorage.removeItem("bookmarkScrollPosition");
            }
        }, 200);
        function fetchBookmarks() {
            dispatch(getBookmark(user._id));
        }
        fetchBookmarks();
        return () => {
            dispatch(bookmarkReset());
            dispatch(authReset());
        };
    }, [navigate, isError, message, dispatch]);
    return (
        <>
            {isLoading ? <Spinner isLoading={isLoading} /> : null}
            <h3>Bookmarks</h3>
            <Box>
                <section className="content">
                    {bookmarks &&
                    bookmarks.length > 0 &&
                    bookmarks[0].bookmark_question.length > 0 ? (
                        <div>
                            {bookmarks[0].bookmark_question &&
                                bookmarks[0].bookmark_question.map(
                                    (question, i) => (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                            key={question._id}
                                        >
                                            <QuestionItem
                                                storeScrollPosition={
                                                    storeScrollPosition
                                                }
                                                question={{
                                                    ...question,
                                                    ...{
                                                        question_user:
                                                            bookmarks[0]
                                                                .question_user[
                                                                i
                                                            ],
                                                    },
                                                }}
                                            />
                                            <DeleteIcon
                                                sx={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    dispatch(
                                                        bookmarkQuestion({
                                                            questionId:
                                                                question._id,
                                                            value: -1,
                                                        })
                                                    )
                                                }
                                            />
                                        </Box>
                                    )
                                )}
                        </div>
                    ) : (
                        <h3>No Bookmarks yet.</h3>
                    )}
                </section>
            </Box>
        </>
    );
}

export default Bookmarks;
