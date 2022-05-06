const mongoose = require("mongoose");

const answerSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: "User",
            },
        ],
        answer: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, "Please add answer"],
        },
        question: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Question",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Answer", answerSchema);
