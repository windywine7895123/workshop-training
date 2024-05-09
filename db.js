require('dotenv').config();
const mongoose = require('mongoose')
const { config } = require('dotenv');

async function main() {
    try {
        // Connect to MongoDB
        const { DB_HOST, DB_PORT, DB_NAME } = process.env
        await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
        console.log("Database connected");
    } catch (error) {
        // If an error occurs during connection, log and handle it
        console.error("Error connecting to database:", error);
    }
}
main();
