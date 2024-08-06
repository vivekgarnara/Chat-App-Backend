const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const performOperations = require("./dbdemo");
const bodyParser = require("body-parser");
const authRouter = require('./routes/authRoute');
const connectDB = require('./config/db');
const saveChatMessage = require('./config/saveChatMessage');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);

connectDB();

app.use('/api',authRouter);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {

    socket.on("setup", (data) => {
        socket.join(data);
        socket.emit("connected");
    })

    socket.on("joinRoom",(data) => {
        socket.join(data);
    })

    socket.on("sendMessage", (data) => {
        // const documentToInsert = { type: "insert", message: data };
        // performOperations(documentToInsert).catch(console.error);
        // socket.join(data.receiverId);
        // console.log(data.receiverId);
        saveChatMessage(data);
        socket.to(data.senderId).emit("receivedMessage", data);
    })

    socket.on("userUpdateNotify",(data) => {
        socket.broadcast.emit("profileUpdateNotification", data);
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