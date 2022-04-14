const asyncHandler = require("express-async-handler");

const Question = require("../models/questionModel");
const User = require("../models/userModel");

// @desc    Get questions
// @route   GET /api/questions
// @access  Private
const getAllQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find();
    res.status(200).json(questions);
});

// @desc    Get questions
// @route   GET /api/questions
// @access  Private
const getUserQuestions = asyncHandler(async (req, res) => {
    const questions = await Question.find({ user: req.user.id });
    res.status(200).json(questions);
});

// @desc    Set Question
// @route   POST /api/questions
// @access  Private
const setQuestion = asyncHandler(async (req, res) => {
    if (
        !req.body.title ||
        !req.body.views ||
        !req.body.tags ||
        !req.body.votes
    ) {
        res.status(400);
        throw new Error("Please add a text field");
    }

    const question = await Question.create({
        user: req.user.id,
        title: req.body.title,
        views: req.body.views,
        votes: req.body.votes,
        tags: req.body.tags,
    });
    res.status(200).json(question);
});

// @desc    Update Question
// @route   PUT /api/questions/:id
// @access  Private
const updateQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!question) {
        res.status(400);
        throw new Error("Question not found");
    }
    // Check for user
    if (!user) {
        res.status(401);
        throw new Error("User not found");
    }
    // Make sure the logged in user matches the Question user
    if (question.user.toString() !== user.id) {
        res.status(401);
        throw new Error("User not authorized");
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    );
    res.status(200).json(updatedQuestion);
});

// @desc    Delete Question
// @route   DELETE /api/questions/:id
// @access  Private
const deleteQuestion = asyncHandler(async (req, res) => {
    const question = await Question.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!question) {
        res.status(400);
        throw new Error("Question not found");
    }
    // Check for user
    if (!user) {
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

module.exports = {
    getUserQuestions,
    setQuestion,
    updateQuestion,
    deleteQuestion,
    getAllQuestions,
};
