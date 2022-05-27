import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import { getAllQuestions, reset } from "../features/questions/questionSlice";
import QuestionItem from "../components/QuestionItem";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { questions, isLoading, isError, message } = useSelector(
        (state) => state.questions
    );

    function storeScrollPosition() {
        sessionStorage.setItem("homepageScrollPosition", window.pageYOffset);
    }

    // asynchronous function (render function)
    useEffect(() => {
        setTimeout(() => {
            if (sessionStorage.getItem("homepageScrollPosition")) {
                const scrollPosition = sessionStorage.getItem(
                    "homepageScrollPosition"
                );
                window.scrollTo(0, parseInt(scrollPosition));
                sessionStorage.removeItem("homepageScrollPosition");
            }
        }, 200);
        dispatch(getAllQuestions());
        return () => {
            dispatch(reset());
        };
    }, [navigate, isError, message, dispatch]);

    return (
        <div id="homepage">
            {isLoading ? <Spinner isLoading={isLoading} /> : null}
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                    mb: { xs: 3, md: 4 },
                }}
            >
                <Typography variant="h6">Latest Questions</Typography>
                <Button
                    variant="contained"
                    to="/questions/ask"
                    component={Link}
                >
                    Create Question
                </Button>
            </Box>
            <section className="content">
                {questions && questions.length > 0 ? (
                    <div className="questions">
                        {questions.map((question) => (
                            <QuestionItem
                                storeScrollPosition={storeScrollPosition}
                                key={question._id}
                                question={question}
                            />
                        ))}
                    </div>
                ) : (
                    <h3>You have not created any questions.</h3>
                )}
            </section>
        </div>
    );
}

export default Home;
