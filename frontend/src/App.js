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
import ErrorPage from "./pages/404";

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
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/forgotpassword"
                        element={<ForgotPassword />}
                    />
                    <Route path="/" element={renderNavbar(<Home />)} />
                    <Route
                        path="/user/:id"
                        element={renderNavbar(
                            <>
                                <Profile underline={"Home"} />
                                <UserInfo />
                            </>
                        )}
                    />
                    <Route
                        path="/user/:id/questions"
                        element={renderNavbar(
                            <>
                                <Profile underline={"Question"} />
                                <UserQuestions />
                            </>
                        )}
                    />
                    <Route
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
                    <Route path="/404" element={renderNavbar(<ErrorPage />)} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
