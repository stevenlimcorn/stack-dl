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
        tags: {
            type: [String],
            required: [true, "Please add tags"],
        },
        description: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, "Please add descriptions"],
        },
        images: {
            type: [String],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Question", questionSchema);
