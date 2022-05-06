const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
const path = require("path");
const generateUploadURL = require("./s3/s3.js");

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/answers/", require("./routes/answerRoute"));
// s3 image upload
app.get("/api/s3url", async (req, res) => {
    const url = await generateUploadURL();
    res.send({ url });
});

// Serve frontend
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
} else {
    app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
