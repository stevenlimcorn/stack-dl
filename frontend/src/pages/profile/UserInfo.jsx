import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography } from "@mui/material";
import {
    getQuestionsByUserId,
    reset,
} from "../../features/questions/questionSlice";
import Spinner from "../../components/Spinner";
import QuestionItem from "../../components/QuestionItem";

function UserQuestions() {
    // End Helper function
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();

    const { user } = useSelector((state) => state.auth);
    const { questions, isLoading } = useSelector((state) => state.questions);
    // const [isUser, setIsUser] = useState(false);
    // asynchronous function (render function)
    useEffect(() => {
        if (user && params.id === user._id) {
            // setIsUser(true);
        }
        dispatch(getQuestionsByUserId(params.id));
        return () => {
            dispatch(reset());
        };
    }, [navigate, dispatch, params, user]);
    return (
        <>
            {isLoading ? <Spinner isLoading={isLoading} /> : null}
            <Typography></Typography>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignContent: "center",
                    mb: { xs: 3, md: 4 },
                    backgroundColor: "white",
                    p: "2.5%",
                    flexDirection: "column",
                }}
            >
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
            </Box>
        </>
    );
}

export default UserQuestions;
