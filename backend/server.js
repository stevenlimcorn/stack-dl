const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
// const cors = require("cors");
// const whitelist = ["http://localhost:3000"];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     credentials: true,
// };

connectDB();

const app = express();

// app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// Serve frontend
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
} else {
    app.get("/", (req, res) => res.send("Please set to production"));
}

app.use(errorHandler);
app.listen(port, () => console.log(`Server started on port ${port}`));
