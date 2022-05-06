const asyncHandler = require("express-async-handler");
const Answer = require("../models/answerModel");
const { default: mongoose } = require("mongoose");

const createAnswer = asyncHandler(async (req, res) => {
    // create answer
    const { answer, likes, questionId } = req.body;
    if (!answer || likes === null) {
        res.status(400);
        throw new Error("Write an answer.");
    }
    console.log(questionId);
    const createdAnswer = await Answer.create({
        user: req.user.id,
        answer: answer,
        likes: likes,
        question: questionId,
    });
    res.status(200).json(createdAnswer);
});

const getAnswerByQuestionId = asyncHandler(async (req, res) => {
    Answer.aggregate([
        {
            $match: {
                question: mongoose.Types.ObjectId(req.params.id),
            },
        },
        {
            $lookup: {
                localField: "user",
                from: "users", //the collection name, (bad)before i had Phrase as the model
                foreignField: "_id",
                as: "answer_user",
            },
        },
        { $unwind: "$answer_user" },
    ]).exec((err, answer) => {
        if (err) {
            res.status(400);
            throw new Error("no answers for that question");
        } else {
            res.status(200).json(answer);
        }
    });
});

const like = asyncHandler(async (req, res) => {
    const answerId = req.params.id;
    const answer = Answer.findById(answerId);
    const like = req.body.like;
    if (!answer) {
        res.status(400);
        throw new Error("Answer not found");
    }
    // dislike
    let updatedAnswer = null;
    console.log(answerId);
    if (like == -1) {
        updatedAnswer = await Answer.findByIdAndUpdate(
            req.params.id,
            { $pull: { likes: req.user.id } },
            {
                new: true,
                upsert: true,
            }
        );
    } else {
        updatedAnswer = await Answer.findByIdAndUpdate(
            req.params.id,
            { $push: { likes: req.user.id } },
            {
                new: true,
                upsert: true,
            }
        );
    }
    console.log(updatedAnswer);
    // like
    res.status(200).json(updatedAnswer);
});

module.exports = {
    createAnswer,
    getAnswerByQuestionId,
    like,
};
