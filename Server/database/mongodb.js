const mongoose = require("mongoose");
const Path = require("../config/env");

if (!Path.DB_URI) {  // Check if DB_URI is not defined
  throw new Error("DB_URI is not defined");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(Path.DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);  // Exit the process if connection fails
  }
};

module.exports = connectToDatabase;
