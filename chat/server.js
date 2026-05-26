const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

/* =========================
   PORT (중요: 배포용 필수)
========================= */
const PORT = process.env.PORT || 3000;

/* =========================
   Socket.IO (배포 안전 설정)
========================= */
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

/* =========================
   Static files (프론트)
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   users store
========================= */
let users = {};

/* =========================
   Socket logic
========================= */
io.on("connection", (socket) => {

    console.log("user connected:", socket.id);

    socket.on("set nickname", (name) => {
        users[socket.id] = name;

        io.emit("user list", Object.values(users));
    });

    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });

    socket.on("disconnect", () => {
        delete users[socket.id];

        io.emit("user list", Object.values(users));

        console.log("user disconnected:", socket.id);
    });
});

/* =========================
   server start (중요 수정)
========================= */
server.listen(PORT, () => {
    console.log("server running on port", PORT);
});