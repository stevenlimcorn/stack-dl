const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUser,
    logout,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// router.post("/register", registerUser);
router.post("/", registerUser);
router.post("/login", loginUser);
// router.post("/requestPasswordReset", )
router.get("/user/:id", getUser);
router.get("/logout", logout);

module.exports = router;
