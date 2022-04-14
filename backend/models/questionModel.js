const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: [true, "Please add a title value"],
        },
        views: {
            type: Number,
            required: [true, "Please add number of views."],
        },
        votes: {
            type: Number,
            required: [true, "Please add number of votes"],
        },
        tags: {
            type: Array,
            required: [true, "Please add tags"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Question", questionSchema);
