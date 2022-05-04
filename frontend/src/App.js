import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/templates/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/profile/Profile";
import UserQuestions from "./pages/profile/UserQuestions";
import UserInfo from "./pages/profile/UserInfo";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import ForgotPassword from "./pages/ForgotPassword";
import AskQuestion from "./pages/AskQuestion";
import Question from "./pages/Question";
import EditProfile from "./pages/profile/EditProfile";

const drawerWidth = 220;
const renderNavbar = (children) => {
    return (
        <>
            <Navbar drawerWidth={drawerWidth} />
            <Box
                component="main"
                sx={{
                    ml: { md: `${drawerWidth}px` },
                    p: { xs: 1.5, md: 3 },
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: "#ebf1f7",
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </>
    );
};

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route
                        exact
                        path="/forgotpassword"
                        element={<ForgotPassword />}
                    />
                    <Route exact path="/" element={renderNavbar(<Home />)} />
                    <Route
                        exact
                        path="/user/:id"
                        element={renderNavbar(
                            <>
                                <Profile underline={"Home"} />
                                <UserInfo />
                            </>
                        )}
                    />
                    <Route
                        exact
                        path="/user/:id/questions"
                        element={renderNavbar(
                            <>
                                <Profile underline={"Question"} />
                                <UserQuestions />
                            </>
                        )}
                    />
                    <Route
                        exact
                        path="/user/:id/editprofile"
                        element={renderNavbar(
                            <>
                                <EditProfile />
                            </>
                        )}
                    />
                    <Route
                        path="/questions/ask"
                        element={renderNavbar(<AskQuestion />)}
                    />
                    <Route
                        path="/questions/:id"
                        element={renderNavbar(<Question />)}
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
