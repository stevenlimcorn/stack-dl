const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.ACTIVATION_TOKEN);

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized");
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const authReset = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            res.status(400);
            throw new Error("Not authorized, no token");
        }
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                res.status(400);
                throw new Error({ msg: "Authentication failed" });
            }
            req.user = user;
        });
        next();
    } catch (err) {
        res.status(500);
        throw new Error(err);
    }
});

module.exports = {
    protect,
    authReset,
};
