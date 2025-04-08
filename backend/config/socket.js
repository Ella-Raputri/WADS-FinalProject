import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow frontend origin
        methods: ["GET", "POST"],
        credentials: true, // ✅ Allow credentials (IMPORTANT)
    },
});

const userSocketMap = {}; // Store userId -> socketId

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        socket.userId = userId; // Store in socket instance
    }
    console.log(`A user connected: ${socket.id} (UserID: ${userId})`);

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Send online users list

    // ✅ Handle Room Joining (if needed)
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`👥 User ${socket.userId} joined room ${roomId}`);
    });

    // ✅ Handle Room Messages (if needed)
    socket.on("sendRoomMessage", ({ roomId, message }) => {
        console.log("di backend: sending room message");
        io.to(roomId).emit("newRoomMessage", message);
    });

    socket.on("joinAdminRoom", (roomId) => {
        socket.join(roomId);
        console.log(`👥 Admin ${socket.userId} joined room ${roomId}`);
    });

    socket.on("sendAdminRoomMessage", ({ roomId, message }) => {
        console.log("di backend: sending admin room message");
        io.to(roomId).emit("newAdminRoomMessage", message);
    });

    // ✅ Handle User Disconnect
    socket.on("disconnect", () => {
        console.log("❌ A user disconnected:", socket.id);
        if (socket.userId) {
            delete userSocketMap[socket.userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update clients
    });
});

export { io, app, server };
