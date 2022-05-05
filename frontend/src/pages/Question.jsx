import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    reset,
    getQuestionById,
    addAnswerQuestion,
} from "../features/questions/questionSlice";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box, Divider, Button } from "@mui/material";
import moment from "moment";
import ReactHtmlParser from "react-html-parser";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SvgIcon from "@material-ui/core/SvgIcon";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import ColoredAvatar from "../components/ColoredAvatar";
import { Link } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";

const mdParser = new MarkdownIt(/* Markdown-it options */);
function Question() {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { questions, isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.questions
    );
    const { user } = useSelector((state) => state.auth);
    const [answer, setAnswer] = useState({
        html: "",
        text: "",
    });
    const [snackbar, setSnackbar] = useState("");

    const parseHtml = (html) => {
        const codeBefore =
            "<pre style='width: 100%; background-color:hsl(0,0%,96.5%); padding: 15px; border-radius:5px; overflow-x: scroll;'>";
        const codeAfter = "</pre>";

        let newHtml = html.replaceAll("<pre>", codeBefore);
        newHtml = newHtml.replaceAll("</pre>", codeAfter);
        return ReactHtmlParser(newHtml);
    };

    const handleEditorChange = ({ html, text }) => {
        setAnswer({
            html: html,
            text: text,
        });
    };

    const handleAnswer = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (answer.html === "" || answer.text === "") {
            setSnackbar({
                msg: "Please fill in the answer",
                key: Math.random(),
                severity: "error",
            });
            return;
        }
        const answerData = {
            answer: answer.html,
            votes: 0,
        };
        const id = params.id;
        const response = await dispatch(addAnswerQuestion({ id, answerData }));
        if (response.meta.requestStatus === "rejected") {
            setSnackbar({
                msg: "Please fill in the description.",
                key: Math.random(),
                severity: "error",
            });
            return;
        }
        if (response.meta.requestStatus === "fulfilled") {
            setAnswer({
                html: "",
                text: "",
            });
            setSnackbar("");
            navigate(`/questions/${response.payload._id}`);
        }
    };

    useEffect(() => {
        if (!params.id.match(/^[0-9a-fA-F]{24}$/)) {
            // navigate to 404
            navigate("/404");
        } else {
            dispatch(getQuestionById(params.id));
        }
        if (isError) {
            // navigate to 404
            navigate("/404");
        }
        return () => {
            dispatch(reset());
        };
    }, [params, isError]);

    if (questions.length > 0) {
        return (
            <>
                <Box
                    id="title-section"
                    marginBottom={2}
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Box>
                        <Typography variant="h5">
                            {questions[0].title}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                mt: 1,
                            }}
                        >
                            <Typography paddingRight={2}>
                                {`Asked ${moment(
                                    new Date(questions[0].createdAt)
                                ).fromNow()}`}
                            </Typography>
                            <Typography color="rgba(0, 0, 0, 0.7)">
                                {`Viewed ${questions[0].views} times`}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Link
                            to={`/user/${questions[0].question_user._id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <ColoredAvatar
                                name={`${questions[0].question_user.firstName} ${questions[0].question_user.lastName}`}
                            />
                        </Link>
                        <Link
                            to={`/user/${questions[0].question_user._id}`}
                            style={{
                                textDecoration: "None",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            <Typography color="primary">
                                {questions[0].question_user.userName}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", flexDirection: "row", my: 2 }}>
                    <Box width="100%">
                        {parseHtml(questions[0].description.html)}
                    </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", my: 2 }}>
                    <Typography>Supporting Images</Typography>
                    {questions[0].images.map((imageSrc) => (
                        <img src={imageSrc} width="400px" />
                    ))}
                </Box>
                <Box>
                    <Typography variant="h6">Your Answer</Typography>
                    <MdEditor
                        style={{ height: "200px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={handleEditorChange}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            mt: 3,
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                width: { xs: "120px" },
                            }}
                            onClick={handleAnswer}
                        >
                            submit
                        </Button>
                    </Box>
                </Box>
                {snackbar ? (
                    <AlertMessage
                        key={snackbar.key}
                        message={snackbar.msg}
                        severity={snackbar.severity}
                    />
                ) : null}
            </>
        );
    }
}

export default Question;
