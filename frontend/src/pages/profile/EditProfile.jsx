import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import AlertMessage from "../../components/AlertMessage";
import { Link } from "react-router-dom";

function EditProfile() {
    // alerts for incorrect forms
    // , isError, isSuccess, message
    const { user, isLoading } = useSelector((state) => state.auth);
    const [snackbar, setSnackbar] = useState("");
    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
    });
    const { firstName, lastName, userName, email } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (
            firstName === "" ||
            lastName === "" ||
            userName === "" ||
            email === ""
        ) {
            setSnackbar({
                msg: "Make sure all the fields are filled.",
                key: Math.random(),
                severity: "error",
            });
        }
    };

    return (
        <Box>
            {isLoading ? <Spinner isLoading={isLoading} /> : null}
            <form onSubmit={handleSubmit}>
                <Typography
                    sx={{
                        typography: { sm: "h6" },
                        marginBottom: {
                            xs: "5px",
                            md: "10px",
                            xl: "15px",
                        },
                    }}
                >
                    Edit Profile
                </Typography>
                <Box
                    sx={{
                        marginTop: {
                            xs: "10px",
                            md: "15px",
                            xl: "20px",
                        },
                        padding: {
                            xs: "10px 15px",
                            md: "20px 25px",
                            xl: "25px 30px",
                        },
                        borderRadius: "5px",
                        backgroundColor: "white",
                        border: "1px solid rgb(222, 223, 224)",
                    }}
                >
                    <Typography
                        sx={{
                            typography: "p",
                        }}
                    >
                        Email
                    </Typography>
                    <TextField
                        id="lastName"
                        value={email}
                        onChange={onChange}
                        name="email"
                        autoFocus
                        size="small"
                    />
                    <Typography
                        sx={{
                            typography: "p",
                            marginTop: {
                                xs: "5px",
                                md: "10px",
                                xl: "15px",
                            },
                        }}
                    >
                        Username
                    </Typography>
                    <TextField
                        id="username"
                        value={userName}
                        onChange={onChange}
                        name="userName"
                        autoFocus
                        size="small"
                    />
                    <Typography
                        sx={{
                            typography: "p",
                            marginTop: {
                                xs: "5px",
                                md: "10px",
                                xl: "15px",
                            },
                        }}
                    >
                        First Name
                    </Typography>
                    <TextField
                        name="firstName"
                        id="firstName"
                        value={firstName}
                        onChange={onChange}
                        autoFocus
                        size="small"
                    />
                    <Typography
                        sx={{
                            typography: "p",
                            marginTop: {
                                xs: "5px",
                                md: "10px",
                                xl: "15px",
                            },
                        }}
                    >
                        Last Name
                    </Typography>
                    <TextField
                        id="lastName"
                        value={lastName}
                        onChange={onChange}
                        name="lastName"
                        autoFocus
                        size="small"
                    />
                </Box>
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                        Save Profile
                    </Button>
                    <Button
                        component={Link}
                        to={`/user/${user._id}`}
                        variant="contained"
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
            {snackbar ? (
                <AlertMessage
                    key={snackbar.key}
                    message={snackbar.msg}
                    severity={snackbar.severity}
                />
            ) : null}
        </Box>
    );
}

export default EditProfile;
