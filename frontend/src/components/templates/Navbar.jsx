import React from "react";
import { styled, alpha } from "@mui/material/styles";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
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
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { logout, authReset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ColoredAvatar from "../ColoredAvatar";
import { Link } from "react-router-dom";

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

    // Search bar styles
    const Search = styled("div")(({ theme }) => ({
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(1),
        marginLeft: 0,
        width: "100%",
        [theme.breakpoints.up("md")]: {
            marginLeft: theme.spacing(1),
        },
    }));

    const SearchIconWrapper = styled("div")(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: "inherit",
        "& .MuiInputBase-input": {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create("width"),
            width: "100%",
            [theme.breakpoints.up("md")]: {
                width: "20ch",
            },
        },
    }));

    const menuItems = [
        { label: "Home", path: "/", icon: <HomeIcon /> },
        { label: "Questions", path: "/accounts", icon: <QuestionAnswerIcon /> },
        { label: "Tags", path: "/organizations", icon: <LocalOfferIcon /> },
    ];

    const drawer = (
        <div>
            <Toolbar />
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
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                        />
                    </Search>
                    {user ? (
                        <>
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
                        </>
                    ) : (
                        <>
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
                        </>
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
