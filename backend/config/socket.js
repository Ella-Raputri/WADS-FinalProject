import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow frontend origin
        methods: ["GET", "POST", "PUT"],
        credentials: true, // Allow credentials 
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

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Send online users list

    // Handle Room Joining (if needed)
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
    });

    // Handle Room Messages (if needed)
    socket.on("sendRoomMessage", ({ roomId, message }) => {
        io.to(roomId).emit("newRoomMessage", message);
    });

    // handle updated status
    socket.on("sendUpdatedStatus", ({roomId, stat}) =>{
        io.to(roomId).emit("updatedStatus", stat);
    });

    // handle admin join collab chat
    socket.on("joinAdminRoom", (roomId) => {
        socket.join(roomId);
    });

    // handle admin send room message
    socket.on("sendAdminRoomMessage", ({ roomId, message }) => {
        io.to(roomId).emit("newAdminRoomMessage", message);
    });

    // Handle User Disconnect
    socket.on("disconnect", () => {
        if (socket.userId) {
            delete userSocketMap[socket.userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update clients
    });
});

export { io, app, server };
