import { Typography, Box, Divider } from "@mui/material";
import SvgIcon from "@material-ui/core/SvgIcon";
import ReactHtmlParser from "react-html-parser";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    like,
    getAnswerByQuestionId,
    answerReset,
} from "../features/answers/answerSlice";
import { useParams } from "react-router-dom";
const parseHtml = (html) => {
    const codeBefore =
        "<pre style='width: 100%; background-color:hsl(0,0%,96.5%); padding: 15px; border-radius:5px; overflow-x: scroll;'>";
    const codeAfter = "</pre>";

    let newHtml = html.replaceAll("<pre>", codeBefore);
    newHtml = newHtml.replaceAll("</pre>", codeAfter);
    return ReactHtmlParser(newHtml);
};

function AnswerItem({ answer }) {
    const [color, setColor] = useState("white");
    const dispatch = useDispatch();
    const params = useParams();
    const { user } = useSelector((state) => state.auth);
    const handleLike = async () => {
        if (color == "white") {
            // like
            setColor("red");
            await dispatch(like({ id: answer._id, value: 1 }));
        } else {
            setColor("white");
            await dispatch(like({ id: answer._id, value: -1 }));
        }
        await dispatch(getAnswerByQuestionId(params.id));
    };
    useEffect(() => {
        if (user && answer.likes.indexOf(user._id) !== -1) {
            setColor("red");
        }
        return () => {
            dispatch(answerReset());
        };
    }, [dispatch]);
    return (
        <>
            <Box
                sx={{
                    my: 3,
                    display: "flex",
                    flexDirection: "row",
                }}
                key={answer._id}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: { xs: "50px", s: "100px" },
                        alignItems: "center",
                    }}
                >
                    <SvgIcon
                        sx={{ transform: "scale(1.5)" }}
                        onClick={handleLike}
                    >
                        <path
                            color={color}
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            stroke="black"
                            strokeWidth={2}
                            cursor="pointer"
                        />
                    </SvgIcon>
                    <Typography>
                        {answer.likes && answer.likes.length}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: {
                            xs: "calc(100% - 50px)",
                            s: "calc(100% - 100px)",
                        },
                    }}
                >
                    {parseHtml(answer.answer.html)}
                </Box>
            </Box>
            <Divider />
        </>
    );
}

export default AnswerItem;
