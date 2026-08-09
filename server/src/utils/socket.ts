import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.model.js";

const getRoomId = (u1: string, u2: string) =>
    crypto.createHash("sha256").update([u1, u2].sort().join("_")).digest("hex");

// userId -> socket.id
const onlineUsers = new Map<string, string>();

export const initializeSocket = (server: HttpServer): SocketIOServer => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:3000",
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        socket.on("userOnline", (userId: string) => {
            onlineUsers.set(userId.toString(), socket.id);
            io.emit("userStatus", { userId, online: true });
        });

        socket.on("joinChat", ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
            if (!userId || !targetUserId) return;
            socket.join(getRoomId(userId, targetUserId));
        });

        socket.on("leaveChat", ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
            if (!userId || !targetUserId) return;
            socket.leave(getRoomId(userId, targetUserId));
        });

        socket.on(
            "sendMessage",
            async ({
                userId,
                targetUserId,
                text,
            }: {
                userId: string;
                targetUserId: string;
                text: string;
            }) => {
                if (!text || !userId || !targetUserId) return;

                const roomId = getRoomId(userId, targetUserId);
                const message = { senderId: userId, text, seen: false };

                let chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });

                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [message],
                        lastMessageAt: new Date(),
                    });
                } else {
                    chat.messages.push(message as any);
                    chat.lastMessageAt = new Date();
                }

                await chat.save();
                const savedMessage = chat.messages.at(-1);

                io.to(roomId).emit("receiveMessage", savedMessage);

                const receiverSocket = onlineUsers.get(targetUserId.toString());
                if (receiverSocket) {
                    io.to(receiverSocket).emit("unreadCountUpdated");
                }
            }
        );

        socket.on("markSeen", async ({ userId, targetUserId }: { userId: string; targetUserId: string }) => {
            const roomId = getRoomId(userId, targetUserId);
            const chat = await Chat.findOne({ participants: { $all: [userId, targetUserId] } });
            if (!chat) return;

            let updated = false;
            chat.messages.forEach((msg) => {
                if (msg.senderId.toString() === targetUserId && msg.seen === false) {
                    msg.seen = true;
                    updated = true;
                }
            });

            if (updated) {
                await chat.save();
                io.to(roomId).emit("messagesSeen");

                const mySocket = onlineUsers.get(userId.toString());
                if (mySocket) {
                    io.to(mySocket).emit("unreadCountUpdated");
                }
            }
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    io.emit("userStatus", { userId, online: false });
                    break;
                }
            }
        });
    });

    return io;
};
