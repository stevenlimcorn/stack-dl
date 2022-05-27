import SvgIcon from "@material-ui/core/SvgIcon";
import {
    bookmarkQuestion,
    bookmarkReset,
    getBookmark,
} from "../features/bookmarks/bookmarkSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Bookmark({ questionId }) {
    const [color, setColor] = useState("grey");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { bookmarks } = useSelector((state) => state.bookmarks);
    const handleBookmark = async () => {
        if (user === null) {
            navigate("/login");
        }
        if (color === "grey") {
            // like
            setColor("#1976d2");
            dispatch(bookmarkQuestion({ questionId: questionId, value: 1 }));
        } else {
            setColor("grey");
            dispatch(bookmarkQuestion({ questionId: questionId, value: -1 }));
        }
    };

    useEffect(() => {
        const fetchBookmarks = async () => {
            dispatch(getBookmark(user._id));
            if (bookmarks && bookmarks[0].bookmark.length > 0) {
                bookmarks[0].bookmark.includes(questionId)
                    ? setColor("#1976d2")
                    : setColor("grey");
            }
        };
        if (user && color !== "#1976d2") {
            fetchBookmarks();
        }
        // return () => {
        //     dispatch(bookmarkReset());
        // };
    }, [dispatch, bookmarks]);
    return (
        <>
            <SvgIcon
                sx={{ transform: "scale(1.5)" }}
                fontSize="large"
                onClick={handleBookmark}
            >
                <path
                    color={color}
                    cursor="pointer"
                    d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"
                />
            </SvgIcon>
        </>
    );
}

export default Bookmark;
