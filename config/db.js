const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const connectionUrl = process.env.db_url;
const dbName = process.env.db_name;
const connectDB = async() => {
    mongoose
    .connect(connectionUrl + "/" + dbName, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));
}

module.exports = connectDB;