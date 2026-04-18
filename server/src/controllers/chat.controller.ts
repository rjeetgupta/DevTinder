import { Request, Response } from "express";
import Chat from "../models/chat.model";
import { ConnectionRequest } from "../models/connection.model";


export const getUnreadCount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const chats = await Chat.find({
            participants: userId,
            "messages.seen": false,
        }).select("messages participants");

        let unreadCount = 0;

        chats.forEach((chat: any) => {
            chat.messages.forEach((msg: any) => {
                if (
                    !msg.seen &&
                    msg.senderId.toString() !== userId.toString()
                ) {
                    unreadCount++;
                }
            });
        });

        res.json({ success: true, data: unreadCount });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const getChatList = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;

        const chats = await Chat.find({
            participants: userId,
        })
            .sort({ lastMessageAt: -1 })
            .populate("participants", "firstName lastName photo")
            .lean();

        const result = chats.map((chat: any) => {
            const otherUser = chat.participants.find(
                (u: any) => u._id.toString() !== userId.toString()
            );

            const unreadCount = chat.messages.filter(
                (msg: any) =>
                    msg.senderId.toString() !== userId.toString() &&
                    msg.seen === false
            ).length;

            const lastMessage = chat.messages.at(-1);

            return {
                chatId: chat._id,
                user: otherUser,
                lastMessage: lastMessage?.text || "",
                lastMessageAt: chat.lastMessageAt,
                unreadCount,
            };
        });

        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getChatByUser = async (req: Request, res: Response) => {
    try {
        const { targetUserId } = req.params;
        const userId = (req as any).user._id;
        const isPremium = (req as any).user.isPremium;

        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate("messages.senderId", "firstName lastName photo");

        // Access control
        if (!isPremium) {
            const isConnected = await ConnectionRequest.findOne({
                status: "accepeted",
                $or: [
                    { fromUserId: userId, toUserId: targetUserId },
                    { fromUserId: targetUserId, toUserId: userId },
                ],
            });

            if (!isConnected && !chat) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Chat allowed only for connections. Upgrade to Premium to chat with anyone!",
                });
            }
        }

        // Create chat if not exists
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }

        // Mark messages as seen
        let hasUnseen = false;

        chat.messages.forEach((msg: any) => {
            if (
                msg.senderId &&
                msg.senderId._id.toString() !== userId.toString() &&
                !msg.seen
            ) {
                msg.seen = true;
                hasUnseen = true;
            }
        });

        if (hasUnseen) {
            await chat.save();
        }

        res.json({ success: true, chat });
    } catch (error: any) {
        console.error("Chat Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export const isConnected = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user._id;
        const { targetUserId } = req.params;

        const connection = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId: userId,
                    toUserId: targetUserId,
                    status: "accepeted",
                },
                {
                    fromUserId: targetUserId,
                    toUserId: userId,
                    status: "accepeted",
                },
            ],
        });

        res.json({
            success: true,
            isConnected: !!connection,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};