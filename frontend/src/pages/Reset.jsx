import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { authReset, resetPassword } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import AlertMessage from "../components/AlertMessage";
import PasswordStrengthBar from "react-password-strength-bar";
import {
    Container,
    CssBaseline,
    Box,
    Grid,
    Button,
    TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";

function Reset() {
    // states redux
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );
    // alerts for incorrect forms
    const [snackbar, setSnackbar] = useState("");
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const { password, confirmPassword } = formData;
    const { token } = useParams();
    // password strength
    const [strength, setStrength] = useState(0);

    // Functions
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
            dispatch(resetPassword({ password: password, token: token }));
            setFormData({
                password: "",
                confirmPassword: "",
            });
        }
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
                                name="password"
                                label="Password"
                                type="password"
                                onChange={onChange}
                                value={password}
                                id="password"
                                autoComplete="new-password"
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
                            <PasswordStrengthBar
                                password={password}
                                minLength={6}
                                onChangeScore={(score, feedback) => {
                                    console.log(score);
                                    setStrength(score);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Reset
                    </Button>
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

export default Reset;
