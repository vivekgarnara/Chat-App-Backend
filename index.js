const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { performOperations } = require("./dbdemo");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.on("sendMessage", (data) => {
        const documentToInsert = { type : "insert", message: data };
        performOperations(documentToInsert).catch(console.error);
        socket.broadcast.emit("receivedMessage", data);
    })
})

server.listen(3001, () => {
    console.log("SERVER CONNECTED");
})