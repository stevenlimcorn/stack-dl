import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/templates/Navbar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

const drawerWidth = 220;
const renderNavbar = (children) => {
    return (
        <>
            <Navbar drawerWidth={drawerWidth} />
            <Box
                component="main"
                sx={{
                    ml: { sm: `${drawerWidth}px` },
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
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
                </Routes>
                <Routes>
                    <Route exact path="/" element={renderNavbar(<Home />)} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
