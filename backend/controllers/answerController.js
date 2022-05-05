const asyncHandler = require("express-async-handler");
const Answer = require("../models/answerModel");

const setAnswer = asyncHandler(async (req, res) => {
    const { user, votes, answer } = req.body;

    if (!user || !answer || votes === null) {
        res.status(400);
        throw new Error("Please make sure to create an answer");
    }
    const question = await Answer.create({
        user: req.user.id,
        votes: votes,
        answer: answer,
    });
    res.status(200).json(question);
});

module.exports = {
    setAnswer,
};
