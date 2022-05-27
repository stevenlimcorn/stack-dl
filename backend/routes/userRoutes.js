const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUser,
    logout,
    updateUser,
    activateUser,
    forgotPassword,
    resetPassword,
} = require("../controllers/userController");
const { protect, authReset } = require("../middleware/authMiddleware");

// router.post("/register", registerUser);
router.post("/", registerUser);
router.post("/activation", activateUser);
router.post("/login", loginUser);
router.post("/forgot_password", forgotPassword);
router.post("/reset_password", authReset, resetPassword);

router.route("/user/:id").get(getUser).put(protect, updateUser);
router.get("/logout", logout);

module.exports = router;
