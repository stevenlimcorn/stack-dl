import moment from "moment";
import { Box, Link, Typography } from "@mui/material";
import ColoredAvatar from "./ColoredAvatar";

function QuestionItem({ question }) {
    return (
        <Box
            sx={{
                width: "100%",
                p: "2.5%",
                borderRadius: "5px",
                backgroundColor: "white",
                color: "rgba(0, 0, 0, 0.7)",
                border: "1px solid rgb(222, 223, 224)",
                mb: 2,
            }}
        >
            {/* User profile left */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Link
                        href={`/user/${question.question_user._id}`}
                        sx={{ textDecoration: "None" }}
                    >
                        <ColoredAvatar
                            name={`${question.question_user.firstName} ${question.question_user.lastName}`}
                        />
                    </Link>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            ml: 2,
                        }}
                    >
                        <Link
                            href={`/user/${question.question_user._id}`}
                            sx={{
                                textDecoration: "None",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            <Typography color="primary">
                                {question.question_user.userName}
                            </Typography>
                        </Link>
                        <Typography fontSize={"10pt"}>
                            created{" "}
                            {`${moment(
                                new Date(question.createdAt)
                            ).fromNow()}`}
                        </Typography>
                    </Box>
                </Box>
                {/* User profile right */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography>{question.votes} votes</Typography>
                    <Typography>{question.views} views</Typography>
                </Box>
            </Box>
            {/* Question content */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    mt: 2,
                }}
            >
                <Link
                    href={`/questions/${question._id}`}
                    sx={{
                        textDecoration: "None",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <Typography variant="h6">{question.title}</Typography>
                </Link>
                {/* <Typography>{question.description}</Typography> */}
            </Box>
        </Box>
    );
}

export default QuestionItem;
