const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUser,
    logout,
    updateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// router.post("/register", registerUser);
router.post("/", registerUser);
router.post("/login", loginUser);
// router.post("/requestPasswordReset", )
router.route("/user/:id").get(getUser).put(protect, updateUser);
router.get("/logout", logout);

module.exports = router;
