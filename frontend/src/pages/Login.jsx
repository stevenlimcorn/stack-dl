import { useState, useEffect } from "react";
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
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";

function Login() {
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
        remember: false,
    });
    const { email, password, remember } = formData;

    // Functions
    const handleSubmit = (event) => {
        event.preventDefault();

        const userData = {
            email,
            password,
            remember,
        };

        dispatch(login(userData));
    };

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRememberMe = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            remember: e.target.checked,
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
                    Log in
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
                                label="Email Address"
                                value={email}
                                onChange={onChange}
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                onChange={onChange}
                                value={password}
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                        <Grid
                            item
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            width="100%"
                        >
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox onChange={handleRememberMe} />
                                    }
                                    label="remember me"
                                />
                            </Grid>
                            <Grid item>
                                <Link
                                    to="/forgotpassword"
                                    variant="body2"
                                    display="flex"
                                >
                                    Forgot password
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Log In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/register" variant="body2">
                                Do not have an account? Sign up
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

export default Login;
