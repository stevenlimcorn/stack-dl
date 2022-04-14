const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    // check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("Email exist.");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateJWT(user._id),
        });
    } else {
        res.status(400);
        throw new Error("invalid user data");
    }
});

// @desc    Handle user login authentication
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateJWT(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid Username and Password.");
    }
});

// @desc    Get user data
// @route   Get /api/users/user
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    const { _id, firstName, lastName, email } = await User.findById(
        req.user.id
    );

    res.status(200).json({
        id: _id,
        firstName,
        lastName,
        email,
    });
});

module.exports = {
    registerUser,
    getUser,
    loginUser,
};
