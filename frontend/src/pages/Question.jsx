import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    reset,
    getQuestionById,
    updateViews,
    // addAnswerQuestion,
} from "../features/questions/questionSlice";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Box, Divider, Button } from "@mui/material";
import moment from "moment";
import ReactHtmlParser from "react-html-parser";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { Link } from "react-router-dom";
import AlertMessage from "../components/AlertMessage";
import {
    answerReset,
    createAnswer,
    getAnswerByQuestionId,
} from "../features/answers/answerSlice";
import AnswerItem from "../components/AnswerItem";
import Bookmark from "../components/Bookmark";

const mdParser = new MarkdownIt(/* Markdown-it options */);
function Question() {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { questions, isError } = useSelector((state) => state.questions);
    const { user } = useSelector((state) => state.auth);
    const { answers } = useSelector((state) => state.answers);
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
            answer: answer,
            questionId: params.id,
            likes: [],
        };
        const response = await dispatch(createAnswer(answerData));
        if (response.meta.requestStatus === "rejected") {
            setSnackbar({
                msg: response.payload,
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
            navigate(`/${params.id}`);
        }
        setSnackbar("");
    };

    useEffect(() => {
        if (!params.id.match(/^[0-9a-fA-F]{24}$/)) {
            navigate("/404");
        } else {
            dispatch(getQuestionById(params.id));
            dispatch(getAnswerByQuestionId(params.id));
        }
        if (user && questions.length > 0 && user._id !== questions[0].user) {
            dispatch(
                updateViews({
                    questionId: params.id,
                    userId: user._id,
                })
            );
        }
        return () => {
            dispatch(reset());
            dispatch(answerReset());
        };
    }, [params, isError, user]);

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
                                {`Viewed by ${questions[0].views.length} people`}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            textAlign: "right",
                            alignItems: "self-end",
                        }}
                    >
                        {questions[0].question_user ? (
                            <>
                                <Typography>Question asked by</Typography>
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
                                <Bookmark questionId={questions[0]._id} />
                            </>
                        ) : null}
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ my: 2 }}>
                    <Typography variant="h6">Description</Typography>
                    <Box width="100%">
                        {parseHtml(questions[0].description.html)}
                        <Typography fontSize="14px">
                            Answers: {answers.length}
                        </Typography>
                    </Box>
                </Box>
                {questions[0].images.length > 0 && (
                    <Box
                        sx={{ display: "flex", flexDirection: "column", my: 2 }}
                    >
                        <Typography variant="h6">Supporting Images</Typography>
                        {questions[0].images.map((imageSrc) => (
                            <img src={imageSrc} width="400px" key={imageSrc} />
                        ))}
                    </Box>
                )}
                {/* display answer section */}
                {answers.length > 0 ? (
                    <>
                        <Typography variant="h6">People's answer</Typography>
                        <Box id="answer-section">
                            {answers.map((userAnswer) => (
                                <AnswerItem
                                    answer={userAnswer}
                                    key={userAnswer._id}
                                />
                            ))}
                        </Box>
                    </>
                ) : null}
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
