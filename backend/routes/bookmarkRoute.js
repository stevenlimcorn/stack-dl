const express = require("express");
const router = express.Router();
const {
    bookmarkQuestion,
    getBookmark,
} = require("../controllers/bookmarkController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, bookmarkQuestion);
router.route("/:id").get(getBookmark);
module.exports = router;
