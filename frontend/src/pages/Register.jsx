import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { register, authReset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import {
    Container,
    CssBaseline,
    Box,
    Grid,
    Button,
    TextField,
} from "@mui/material";
import AlertMessage from "../components/AlertMessage";
import PasswordStrengthBar from "react-password-strength-bar";

function Register() {
    // setting data
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // alerts for incorrect forms
    const [snackbar, setSnackbar] = useState("");
    // password strength
    const [strength, setStrength] = useState(0);
    // form data
    const { firstName, lastName, userName, email, password, confirmPassword } =
        formData;

    // states redux
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

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

        dispatch(authReset());
    }, [user, isError, isSuccess, message, dispatch]);

    // updates state variables for form data changes
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    // submit form
    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            // create error alert
            setSnackbar({
                msg: "First password and confirm password mismatch.",
                key: Math.random(),
                severity: "error",
            });
        } else if (strength < 3) {
            setSnackbar({
                msg: "Password too weak!",
                key: Math.random(),
                severity: "error",
            });
        } else {
            const userData = {
                firstName,
                lastName,
                userName,
                email,
                password,
            };
            dispatch(register(userData));
        }
    };

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
                    Sign up
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    value={firstName}
                                    onChange={onChange}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    value={lastName}
                                    onChange={onChange}
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    value={userName}
                                    onChange={onChange}
                                    name="userName"
                                    autoComplete="username"
                                />
                            </Grid>
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
                                <PasswordStrengthBar
                                    password={password}
                                    minLength={6}
                                    onChangeScore={(score, feedback) => {
                                        console.log(score);
                                        setStrength(score);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    onChange={onChange}
                                    value={confirmPassword}
                                    id="confirmPassword"
                                    autoComplete="confirm pasword"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/login">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
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

export default Register;
