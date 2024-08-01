const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const performOperations = require("./dbdemo");
const userModel = require("./models/userModel");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotnev = require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRouter = require('./routes/authRoute');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectionUrl = process.env.db_url;
const dbName = process.env.db_name;
const jwtSecretKey = process.env.jwt_secret_key;

const server = http.createServer(app);

mongoose
    .connect(connectionUrl + "/" + dbName, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

// app.post('/register', async (req, res) => {
//     userModel.create(req.body)
//         .then(result => res.json(result))
//         .catch(error => res.json(error))
// });

// app.post('/login', async (req, res) => {
//     try {
//         const user = await userModel.findOne({ email: req.body.email });
//         if (!user) return res.status(404).send({ message: 'Email not found.' });

//         const isMatch = await bcrypt.compare(req.body.password, user.password);
//         if (!isMatch) return res.status(400).send({ message: 'Invalid password.' });

//         const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecretKey, { expiresIn: '10m' });
//         res.send({ token, userId: user._id });
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

app.use('/',authRouter);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on("sendMessage", (data) => {
        const documentToInsert = { type: "insert", message: data };
        performOperations(documentToInsert).catch(console.error);
        socket.broadcast.emit("receivedMessage", data);
    })
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

server.listen(3001, () => {
    console.log("SERVER CONNECTED");
});