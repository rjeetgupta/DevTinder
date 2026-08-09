import { Request, Response } from "express";
import Chat from "../models/chat.model.js";
import ConnectionRequestModel from "../models/connection.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { CONNECTION_STATUS } from "../constant/connection.status.js";

/**
 * GET /chat/:targetUserId
 * Free users can only open a chat if they're connected, OR a reply chat
 * already exists (e.g. a premium user messaged them first).
 */
export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
    const { targetUserId } = req.params;
    const userId = req.user!._id;

    let chat = await Chat.findOne({
        participants: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName photo");

    if (!req.user!.isPremium) {
        const isConnected = await ConnectionRequestModel.findOne({
            status: CONNECTION_STATUS.ACCEPTED,
            $or: [
                { fromUserId: userId, toUserId: targetUserId },
                { fromUserId: targetUserId, toUserId: userId },
            ],
        });

        if (!isConnected && !chat) {
            throw new ApiError(403, "Chat allowed only for connections. Upgrade to Premium to chat with anyone!");
        }
    }

    if (!chat) {
        chat = await Chat.create({ participants: [userId, targetUserId], messages: [] });
    }

    let hasUnseen = false;
    chat.messages.forEach((msg: any) => {
        if (msg.senderId && msg.senderId._id.toString() !== userId.toString() && !msg.seen) {
            msg.seen = true;
            hasUnseen = true;
        }
    });

    if (hasUnseen) {
        await chat.save();
    }

    res.json({ success: true, chat });
});

// GET /chat/list
export const getChatList = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const chats = await Chat.find({ participants: userId })
        .sort({ lastMessageAt: -1 })
        .populate("participants", "firstName lastName photo")
        .lean();

    const result = chats.map((chat: any) => {
        const otherUser = chat.participants.find((u: any) => u._id.toString() !== userId.toString());

        const unreadCount = chat.messages.filter(
            (msg: any) => msg.senderId.toString() !== userId.toString() && msg.seen === false
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

    res.status(200).json(new ApiResponse(200, result, "Chat list fetched successfully"));
});

// GET /chat/unread-count
export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;

    const chats = await Chat.find({
        participants: userId,
        "messages.seen": false,
    }).select("messages participants");

    let unreadCount = 0;
    chats.forEach((chat) => {
        chat.messages.forEach((msg) => {
            if (!msg.seen && msg.senderId.toString() !== userId.toString()) {
                unreadCount++;
            }
        });
    });

    res.status(200).json(new ApiResponse(200, unreadCount, "Unread count fetched successfully"));
});

// GET /chat/is-connected/:targetUserId
export const checkChatIsConnected = asyncHandler(async (req: Request, res: Response) => {
    const loggedInUserId = req.user!._id;
    const { targetUserId } = req.params;

    const connection = await ConnectionRequestModel.findOne({
        status: CONNECTION_STATUS.ACCEPTED,
        $or: [
            { fromUserId: loggedInUserId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: loggedInUserId },
        ],
    });

    res.json({ success: true, isConnected: !!connection });
});
