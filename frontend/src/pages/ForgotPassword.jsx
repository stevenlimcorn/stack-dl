import { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { authReset, forgotPassword } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import AlertMessage from "../components/AlertMessage";
import {
    Container,
    CssBaseline,
    Box,
    Grid,
    Button,
    TextField,
} from "@mui/material";

function ForgotPassword() {
    // states redux
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );
    // alerts for incorrect forms
    const [snackbar, setSnackbar] = useState("");
    const [email, setEmail] = useState("");

    // Functions
    const handleSubmit = (event) => {
        event.preventDefault();

        if (email === "") {
            setSnackbar({
                msg: "Please fill in the email.",
                key: Math.random(),
                severity: "error",
            });
        }
        dispatch(forgotPassword({ email: email }));
        setEmail("");
    };

    const onChange = (e) => {
        setEmail(e.target.value);
    };

    useEffect(() => {
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
        return () => {
            dispatch(authReset());
        };
    }, [isError, isSuccess, message, dispatch]);

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
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{ textAlign: "center" }}
                >
                    Forgot Password
                </Typography>
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Enter your email address"
                                value={email}
                                onChange={onChange}
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                {"< Go back to home page"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
                {snackbar ? (
                    <AlertMessage
                        key={snackbar.key}
                        message={snackbar.msg}
                        severity={snackbar.severity}
                    />
                ) : null}
            </Box>
        </Container>
    );
}

export default ForgotPassword;
