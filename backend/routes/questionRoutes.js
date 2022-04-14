const express = require("express");
const router = express.Router();
const {
    getAllQuestions,
    getUserQuestions,
    setQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

router.route("/all").get(getAllQuestions);
router.route("/").get(protect, getUserQuestions).post(protect, setQuestion);
router
    .route("/:id")
    .delete(protect, deleteQuestion)
    .put(protect, updateQuestion);

module.exports = router;
