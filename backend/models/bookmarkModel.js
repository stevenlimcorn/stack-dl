const mongoose = require("mongoose");

const bookmarkSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        bookmark: [
            {
                type: mongoose.Schema.Types.ObjectId,
                required: false,
                ref: "Question",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
