import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Button, Divider, Typography } from "@mui/material";
import ColoredAvatar from "../../components/ColoredAvatar";
import moment from "moment";
import {
    getQuestionsByUserId,
    reset,
} from "../../features/questions/questionSlice";
import Spinner from "../../components/Spinner";
import authService from "../../features/auth/authService";
import { Link } from "react-router-dom";
import {
    bookmarkReset,
    getBookmark,
} from "../../features/bookmarks/bookmarkSlice";
import ProfileMenu from "./ProfileMenu";

function Profile() {
    // helper functions
    const getStatistics = (questions) => {
        const stats = {
            Views: 0,
            "Total Questions": questions.length,
            "Total Bookmarks": 0,
        };
        questions.forEach((question) => {
            stats.Views += question["views"].length;
        });
        if (bookmarks && bookmarks.length > 0) {
            stats["Total Bookmarks"] = bookmarks[0].bookmark.length;
        }
        return stats;
    };
    // End Helper function
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const { user } = useSelector((state) => state.auth);
    const { bookmarks } = useSelector((state) => state.bookmarks);
    const { questions, isLoading } = useSelector((state) => state.questions);
    const [isUser, setIsUser] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    // asynchronous function (render function)
    useEffect(() => {
        if (user && params.id === user._id) {
            setUserProfile(user);
            setIsUser(true);
            dispatch(getQuestionsByUserId(user._id));
            dispatch(getBookmark(user._id));
        } else if (params.id.match(/^[0-9a-fA-F]{24}$/)) {
            authService
                .getUser(params.id)
                .then((user) => {
                    setUserProfile(user);
                    dispatch(getQuestionsByUserId(params.id));
                    dispatch(getBookmark(params.id));
                })
                .catch((err) => {
                    setUserProfile(null);
                });
        } else {
            setUserProfile(null);
        }
        return () => {
            dispatch(reset());
            dispatch(bookmarkReset());
        };
    }, [navigate, dispatch, params, user]);

    const infoGraphics = getStatistics(questions);
    if (userProfile) {
        return (
            <>
                {isLoading ? <Spinner isLoading={isLoading} /> : null}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignContent: "center",
                        mb: { xs: 3, md: 4 },
                        backgroundColor: "white",
                        p: "2.5%",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: { xs: "100%", md: "150px" },
                            alignItems: "center",
                            mr: { xs: 0, md: 3 },

                            justifyContent: "center",
                        }}
                    >
                        <ColoredAvatar
                            name={`${userProfile.firstName} ${userProfile.lastName}`}
                            width="150px"
                            height="150px"
                        />
                    </Box>
                    <Box
                        sx={{
                            width: {
                                xs: "100%",
                                md: `calc(100% - 150px)`,
                            },
                            height: "fit-content",
                            display: "flex",
                            flexDirection: "column",
                            ml: { xs: 0, md: 3 },
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: "row",
                            }}
                        >
                            <Typography variant="h5">
                                {`${userProfile.userName}`}
                            </Typography>

                            {isUser ? (
                                <Button
                                    component={Link}
                                    to="editprofile"
                                    variant="contained"
                                >
                                    Edit Profile
                                </Button>
                            ) : null}
                        </Box>
                        <Box>
                            {`joined ${moment(
                                new Date(userProfile.createdAt)
                            ).fromNow()}`}
                        </Box>
                        <Divider variant="fullWidth" sx={{ my: 2 }} />
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "row",
                            }}
                        >
                            {Object.keys(infoGraphics).map((key, index) => {
                                return (
                                    <Box
                                        key={key}
                                        sx={{
                                            mr: 2,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                textAlign: "center",
                                                color: "#1976d2",
                                            }}
                                        >
                                            {key}
                                        </Typography>
                                        <Typography align="center">
                                            {infoGraphics[key]}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Box>
                <ProfileMenu statistics={infoGraphics} />
            </>
        );
    } else {
        return <>User Not Found</>;
    }
}

export default Profile;
