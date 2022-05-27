const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendMail = require("../utils/sendMail");

// HELPER FUNCTIONS FOR GENERATING TOKENS
// @desc    Register new user
// @route   POST /api/users
// @access  Public
const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.ACTIVATION_TOKEN, {
        expiresIn: "30d",
    });
};

const createToken = {
    activation: (payload) => {
        return jwt.sign(payload, process.env.ACTIVATION_TOKEN, {
            expiresIn: "5m",
        });
    },
    access: (payload) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN, {
            expiresIn: "15m",
        });
    },
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
    // get info
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

    const user = {
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
    };

    const activation_token = createToken.activation(user);

    // send email const
    const url = `http://localhost:3000/#/activate/${activation_token}`;
    sendMail.sendEmailRegister(email, url, "Verify Your Email");
    res.status(200).json({ msg: "Welcome, please check your email." });
});

const activateUser = asyncHandler(async (req, res) => {
    // get token
    const { activation_token } = req.body;
    // verify token
    const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN);
    const { firstName, lastName, userName, email, password } = user;
    // check user
    const check = await User.findOne({ email });
    if (check) {
        res.status(400);
        throw new Error("This email already existed.");
    }
    const newUser = await User.create({
        firstName,
        lastName,
        userName,
        email,
        password,
    });
    if (!newUser) {
        res.status(400);
        throw new Error("invalid user data");
    } else {
        res.status(200).json({
            msg: "Registration successful, please login.",
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
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    // validate email
    if (!validateEmail(email)) {
        res.status(400);
        throw new Error("Please enter a proper email");
    }
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("Email not registered in system.");
    }
    const accessToken = createToken.access({ id: user.id });
    // send email
    const url = `http://localhost:3000/#/resetpassword/${accessToken}`;
    const name = user.userName;
    sendMail.sendEmailReset(email, url, "Reset your password", name);

    res.status(200).json({ msg: "Re-send the password, check your email." });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    console.log(req.body);

    // check password less than 6 characters
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password length must be at least 6 characters.");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // update password
    await User.findOneAndUpdate(
        { _id: req.user.id },
        { password: hashedPassword }
    );
    res.status(200).json({ msg: "Password was updated successfully." });
});

// @desc    Get user data
// @route   Get /api/users/user
// @access  Public
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

// @desc    Get user data
// @route   Get /api/users/user
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, userName, email } = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(400);
        throw new Error("User doesn't exist");
    }
    if (email) {
        if (!validateEmail(email)) {
            res.status(400);
            throw new Error("Please enter a proper email");
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(400);
            throw new Error("Email exist.");
        }
    }
    if (userName) {
        const userNameExists = await User.findOne({ userName });
        if (userNameExists) {
            res.status(400);
            throw new Error("User Name exist.");
        }
    }
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
    });
    const userData = {
        _id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        userName: updatedUser.userName,
        email: updatedUser.email,
        token: generateJWT(updatedUser._id),
        createdAt: updatedUser.createdAt,
    };
    // check if user wants to remember me
    if (req.cookies["user"] !== undefined) {
        res.cookie("user", JSON.stringify(userData), {
            maxAge: 1000 * 60 * 60 * 24 * 30,
        });
    }
    res.status(200).json(userData);
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
    updateUser,
    activateUser,
    forgotPassword,
    resetPassword,
};
