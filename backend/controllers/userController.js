const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// HELPER FUNCTIONS FOR GENERATING TOKENS
// @desc    Register new user
// @route   POST /api/users
// @access  Public
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "5m",
    });
};

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "15m",
    });
};

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};

// @desc    Validate Email
const validateEmail = (email) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;
    // check if entry is not empty
    if (!firstName || !lastName || !email || !password || !userName) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    // validate email
    if (!validateEmail(email)) {
        res.status(400);
        throw new Error("Please enter a proper email");
    }

    // check if user exists
    const emailExists = await User.findOne({ email });
    const userNameExists = await User.findOne({ userName });
    if (emailExists) {
        res.status(400);
        throw new Error("Email exist.");
    }

    if (userNameExists) {
        res.status(400);
        throw new Error("User Name exist.");
    }

    // check password less than 6 characters
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password length must be at least 6 characters.");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // const newUser = {
    //     firstName,
    //     lastName,
    //     email,
    //     password: hashedPassword,
    // };
    // const activation_token = createActivationToken(newUser);
    // const url = `${process.env.CLIENT_URL}/user/activate/${activation_token}`;
    // sendMail(email, url);

    // create user
    const user = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
    });

    if (!user) {
        res.status(400);
        throw new Error("invalid user data");
    } else {
        // res.cookie("token", token, {
        //     expires: new Date(Date.now() + 20 * 3600),
        //     httpOnly: true,
        //     secure: true,
        // });
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            token: generateJWT(user._id),
            createdAt: user.createdAt,
        });
    }
});

// @desc    Handle user login authentication
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, remember } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        // const token = remember ? generateJWT(user._id) : null;
        const userData = {
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            token: generateJWT(user._id),
            createdAt: user.createdAt,
        };
        if (remember) {
            res.cookie("user", JSON.stringify(userData), {
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
        }
        res.status(201).json(userData);
    } else {
        res.status(400);
        throw new Error("Invalid Username and Password.");
    }
});

// @desc    Handle user login authentication
// @route   POST /api/users/login
// @access  Public
const forgottenPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("Invalid Username and Password.");
    }
    const ac_token = crea;
});

// @desc    Get user data
// @route   Get /api/users/user
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        res.status(200).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            createdAt: user.createdAt,
        });
    } else {
        res.status(400);
        throw new Error("ID doesn't exist");
    }
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("user");
    res.status(200).json({ message: "token cleared" });
});

module.exports = {
    registerUser,
    getUser,
    loginUser,
    logout,
    getUser,
};
