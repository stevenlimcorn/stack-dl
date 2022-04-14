const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log(process.env.STACK_DL_URI);
        const connection = await mongoose.connect(process.env.STACK_DL_URI);
        console.log(`MongoDB Connected: ${connection.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
