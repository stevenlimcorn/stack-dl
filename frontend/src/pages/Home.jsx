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

    // asynchronous function (render function)
    useEffect(() => {
        dispatch(getAllQuestions());
        return () => {
            dispatch(reset());
        };
    }, [navigate, isError, message, dispatch]);

    return (
        <>
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
                {questions.length > 0 ? (
                    <div className="questions">
                        {questions.map((question) => (
                            <QuestionItem
                                key={question._id}
                                question={question}
                            />
                        ))}
                    </div>
                ) : (
                    <h3>You have not created any questions.</h3>
                )}
            </section>
        </>
    );
}

export default Home;
