const express = require("express");
const router = express.Router();
const {
    createAnswer,
    getAnswerByQuestionId,
    like,
} = require("../controllers/answerController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createAnswer);
router.route("/:id").get(getAnswerByQuestionId);
router.route("/like/:id").post(protect, like);

module.exports = router;
