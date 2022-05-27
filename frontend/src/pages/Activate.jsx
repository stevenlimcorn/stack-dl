import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { activate } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import { Container, CssBaseline, Box } from "@mui/material";
import AlertMessage from "../components/AlertMessage";

function Activate() {
    // states redux
    const dispatch = useDispatch();
    const { activation_token } = useParams();

    const { isLoading, isSuccess, isError, message } = useSelector(
        (state) => state.auth
    );
    const [snackbar, setSnackbar] = useState("");

    useEffect(() => {
        if (activation_token) {
            if (message === "") {
                dispatch(activate(activation_token));
            }
            if (isError) {
                setSnackbar({
                    msg: message,
                    key: Math.random(),
                    severity: "error",
                });
            }
            if (isSuccess) {
                setSnackbar({
                    msg: message,
                    key: Math.random(),
                    severity: "success",
                });
            }
        }
    }, [message]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            {isLoading ? <Spinner isLoading={isLoading} /> : null}
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography>
                    ready to login? click
                    <Link to="/login">here</Link>
                </Typography>
            </Box>
            {snackbar ? (
                <AlertMessage
                    key={snackbar.key}
                    message={snackbar.msg}
                    severity={snackbar.severity}
                />
            ) : null}
        </Container>
    );
}

export default Activate;
