const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

const Question = require("../models/questionModel");
const User = require("../models/userModel");
const Answer = require("../models/answerModel");

// @desc    Get questions
// @route   GET /api/questions
// @access  Public
const getAllQuestions = asyncHandler(async (req, res) => {
    // create a recommendation system that grabs the most related posts based on user's viewed posts, tags, questions posted
    Question.aggregate([
        {
            $lookup: {
                localField: "user",
                from: "users", //the collection name, (bad)before i had Phrase as the model
                foreignField: "_id",
                as: "question_user",
            },
        },
        { $unwind: "$question_user" },
    ]).exec((err, questions) => {
        if (err) {
            res.status(400);
            throw err;
        } else {
            res.status(200).json(questions);
        }
    });
});

const getQuestionById = asyncHandler(async (req, res) => {
    Question.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "question_user",
            },
        },
        { $unwind: "$question_user" },
    ]).exec((err, questions) => {
        if (err) {
            res.status(400);
            throw err;
        } else {
            res.status(200).json(questions);
        }
    });
});

// @desc    Get questions
// @route   GET /api/questions
// @access  Private
const getQuestionsByUserId = asyncHandler(async (req, res) => {
    Question.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(req.params.id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "question_user",
            },
        },
        { $unwind: "$question_user" },
    ]).exec((err, questions) => {
        if (err) {
            res.status(400);
            throw err;
        } else {
            res.status(200).json(questions);
        }
    });
});

// @desc    Set Question
// @route   POST /api/questions
// @access  Private
const setQuestion = asyncHandler(async (req, res) => {
    const { title, description, tags, views, votes, images } = req.body;

    if (!title || !tags || !description || votes === null || views === null) {
        res.status(400);
        throw new Error("Please make sure all tags are added");
    }
    const question = await Question.create({
        user: req.user.id,
        title: title,
        views: views,
        votes: votes,
        tags: tags,
        description: description,
        images: images,
    });
    res.status(200).json(question);
});

// @desc    Delete Question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);

    if (!question) {
        res.status(400);
        throw new Error("Question not found");
    }
    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error("User not found");
    }
    // Make sure the logged in user matches the Question user
    if (question.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }
    await question.remove();
    res.status(200).json({ id: req.params.id });
});

// @desc    Update views
// @route   DELETE /api/questions/:id
// @access  Private
const updateViews = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    const userId = req.body.id;
    console.log(req.params.id);
    if (!question) {
        res.status(400);
        throw new Error("Question not found");
    }
    updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { views: userId } },
        {
            new: true,
            upsert: true,
        }
    );
    console.log(updatedQuestion);
    res.status(200).json({ msg: "updated" });
});

module.exports = {
    setQuestion,
    deleteQuestion,
    getAllQuestions,
    getQuestionsByUserId,
    getQuestionById,
    updateViews,
};
