const asyncHandler = require("express-async-handler");
const Bookmark = require("../models/bookmarkModel");
const Question = require("../models/questionModel");
const { default: mongoose } = require("mongoose");

const bookmarkQuestion = asyncHandler(async (req, res) => {
    // create answer
    const { questionId, value } = req.body;
    const userId = req.user._id;
    let bookmark = await Bookmark.findOne({ user: userId });
    if (!bookmark) {
        bookmark = await Bookmark.create({
            user: userId,
            bookmark: [],
        });
    }
    let updatedBookmark = null;
    if (value == -1) {
        updatedBookmark = await Bookmark.findByIdAndUpdate(
            bookmark._id,
            { $pull: { bookmark: questionId } },
            {
                new: true,
                upsert: true,
            }
        );
    } else {
        updatedBookmark = await Bookmark.findByIdAndUpdate(
            bookmark._id,
            { $addToSet: { bookmark: questionId } },
            {
                new: true,
                upsert: true,
            }
        );
    }
    res.status(200).json(updatedBookmark);
});

const getBookmark = asyncHandler(async (req, res) => {
    Bookmark.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(req.params.id),
            },
        },
        { $unwind: "$bookmark" },
        {
            $lookup: {
                from: "questions",
                localField: "bookmark",
                foreignField: "_id",
                as: "bookmark_question",
            },
        },
        { $unwind: "$bookmark_question" },
        {
            $lookup: {
                from: "users",
                localField: "bookmark_question.user",
                foreignField: "_id",
                as: "question_user",
            },
        },
        { $unwind: "$question_user" },
        {
            $group: {
                _id: "$_id",
                bookmark: { $push: "$bookmark" },
                bookmark_question: { $push: "$bookmark_question" },
                question_user: { $push: "$question_user" },
            },
        },
    ]).exec((err, answer) => {
        if (err) {
            res.status(400);
            throw new Error("no answers for that question");
        } else {
            res.status(200).json(answer);
        }
    });
});

module.exports = {
    bookmarkQuestion,
    getBookmark,
};
