import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.model";
import { Types } from "mongoose";


interface SendMessagePayload {
    userId: string;
    targetUserId: string;
    text: string;
}

interface JoinChatPayload {
    userId: string;
    targetUserId: string;
}


const getRoomId = (u1: string, u2: string): string =>
    crypto
        .createHash("sha256")
        .update([u1, u2].sort().join("_"))
        .digest("hex");


const onlineUsers = new Map<string, string>(); // userId -> socketId


export const initializeSocket = (server: HTTPServer) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        socket.on("userOnline", (userId: string) => {
            if (!userId) return;

            onlineUsers.set(userId.toString(), socket.id);

            io.emit("userStatus", { userId, online: true });
        });

        socket.on("joinChat", ({ userId, targetUserId }: JoinChatPayload) => {
            if (!userId || !targetUserId) return;

            const roomId = getRoomId(userId, targetUserId);
            socket.join(roomId);
        });

        socket.on(
            "sendMessage",
            async ({ userId, targetUserId, text }: SendMessagePayload) => {
                if (!userId || !targetUserId || !text) return;

                const roomId = getRoomId(userId, targetUserId);

                const message = {
                    senderId: new Types.ObjectId(userId),
                    text,
                    seen: false,
                };

                let chat = await Chat.findOne({
                    participants: {
                        $all: [
                            new Types.ObjectId(userId),
                            new Types.ObjectId(targetUserId),
                        ],
                    },
                });

                if (!chat) {
                    chat = new Chat({
                        participants: [
                            new Types.ObjectId(userId),
                            new Types.ObjectId(targetUserId),
                        ],
                        messages: [message],
                        lastMessageAt: new Date(),
                    });
                } else {
                    chat.messages.push(message as any);
                    chat.lastMessageAt = new Date();
                }

                await chat.save();

                const savedMessage =
                    chat.messages[chat.messages.length - 1];

                // ✅ Chat window update
                io.to(roomId).emit("receiveMessage", savedMessage);

                // ✅ Unread badge (receiver)
                const receiverSocket = onlineUsers.get(
                    targetUserId.toString()
                );

                if (receiverSocket) {
                    io.to(receiverSocket).emit("unreadCountUpdated");
                }
            }
        );

        socket.on(
            "markSeen",
            async ({ userId, targetUserId }: JoinChatPayload) => {
                if (!userId || !targetUserId) return;

                const roomId = getRoomId(userId, targetUserId);

                const chat = await Chat.findOne({
                    participants: {
                        $all: [
                            new Types.ObjectId(userId),
                            new Types.ObjectId(targetUserId),
                        ],
                    },
                });

                if (!chat) return;

                let updated = false;

                chat.messages.forEach((msg: any) => {
                    if (
                        msg.senderId.toString() === targetUserId &&
                        msg.seen === false
                    ) {
                        msg.seen = true;
                        updated = true;
                    }
                });

                if (updated) {
                    await chat.save();

                    // ✅ Blue ticks
                    io.to(roomId).emit("messagesSeen");

                    // ✅ Update unread badge (self)
                    const mySocket = onlineUsers.get(userId.toString());

                    if (mySocket) {
                        io.to(mySocket).emit("unreadCountUpdated");
                    }
                }
            }
        );

        socket.on("leaveChat", ({ userId, targetUserId }: JoinChatPayload) => {
            if (!userId || !targetUserId) return;

            const roomId = getRoomId(userId, targetUserId);
            socket.leave(roomId);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);

                    io.emit("userStatus", {
                        userId,
                        online: false,
                    });
                    break;
                }
            }
        });
    });
};