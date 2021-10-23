const mongoose = require("mongoose");

const databaseName = "task-manager";
const connectionURL = process.env.MONGODB_URL;

mongoose.connect(connectionURL);
