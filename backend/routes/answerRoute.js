const express = require("express");
const router = express.Router();
const { setAnswer } = require("../controllers/answerController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, setAnswer);

module.exports = router;
