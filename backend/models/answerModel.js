const mongoose = require("mongoose");

const answerSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        votes: {
            type: Number,
            required: [true, "Please add number of votes"],
        },
        answer: {
            type: String,
            required: [true, "Please add an answer"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Answer", answerSchema);
