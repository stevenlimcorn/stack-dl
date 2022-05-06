const express = require("express");
const router = express.Router();
const {
    getAllQuestions,
    setQuestion,
    addAnswerQuestion,
    deleteQuestion,
    getQuestionsByUserId,
    getQuestionById,
} = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/all").get(getAllQuestions);
router.route("/").post(protect, setQuestion);
router.route("/:id").delete(protect, deleteQuestion).get(getQuestionById);

router.route("/user/:id").get(getQuestionsByUserId);

module.exports = router;
