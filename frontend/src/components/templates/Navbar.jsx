import React from "react";
import { styled, alpha } from "@mui/material/styles";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { logout, authReset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ColoredAvatar from "../ColoredAvatar";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

function Navbar({ drawerWidth }) {
    // states
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(authReset());
        navigate("/");
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { label: "Home", path: "/", icon: <HomeIcon color="primary" /> },
        {
            label: "Bookmarks",
            path: user ? "/bookmarks" : "/login",
            icon: <BookmarkIcon color="primary" />,
        },
    ];

    const drawer = (
        <div>
            <Toolbar
                onClick={() => navigate("/")}
                sx={{ display: "flex", cursor: "pointer" }}
            >
                <img src="/logo.png" alt="logo" width="35px" />
                <Typography sx={{ paddingLeft: "10px", fontSize: "16pt" }}>
                    Stack <span style={{ color: "#1976d2" }}>DL</span>
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map(({ label, icon, path }) => {
                    return (
                        <ListItem button component={Link} key={label} to={path}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: { xs: "space-between", md: "flex-end" },
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {user ? (
                        <div>
                            <Button
                                sx={{ mx: 1 }}
                                onClick={onLogout}
                                color="inherit"
                            >
                                Logout
                            </Button>
                            <Button component={Link} to={`/user/${user._id}`}>
                                <ColoredAvatar
                                    name={`${user.firstName} ${user.lastName}`}
                                />
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Button
                                component={Link}
                                sx={{ mx: 1 }}
                                to="/login"
                                color="inherit"
                            >
                                Login
                            </Button>
                            <Button
                                component={Link}
                                sx={{ mx: 1 }}
                                to="/register"
                                color="inherit"
                            >
                                Register
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", md: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

Navbar.propTypes = {
    drawerWidth: PropTypes.number,
};

export default Navbar;
