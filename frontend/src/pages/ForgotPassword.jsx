import { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, authReset } from "../features/auth/authSlice";
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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );
    // alerts for incorrect forms
    const [snackbar, setSnackbar] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formData;

    // Functions
    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = {
            email,
            password,
        };

        dispatch(login(userData));
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (isError) {
            setSnackbar({
                msg: message,
                key: Math.random(),
                severity: "error",
            });
        }
        if (isSuccess || user) {
            navigate("/");
        }

        dispatch(authReset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

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
                    Password Reset
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
