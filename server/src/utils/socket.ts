import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.model.js";

const getRoomId = (u1: string, u2: string) =>
	crypto
		.createHash("sha256")
		.update([u1, u2].sort().join("_"))
		.digest("hex");

// userId -> multiple socket IDs
//
// One user can have:
// - multiple browser tabs
// - multiple devices
//
// So we keep a Set of socket IDs instead of only one socket ID.
const onlineUsers = new Map<string, Set<string>>();

export const initializeSocket = (
	server: HttpServer,
): SocketIOServer => {
	const io = new SocketIOServer(server, {
		cors: {
			origin:
				process.env.CORS_ORIGIN ||
				"http://localhost:3000",
			credentials: true,
		},
	});

	io.on("connection", (socket: Socket) => {
		console.log("Socket connected:", socket.id);

		// USER ONLINE

		socket.on("userOnline", (userId: string) => {
			if (!userId) return;

			const normalizedUserId = userId.toString();

			let sockets = onlineUsers.get(normalizedUserId);

			if (!sockets) {
				sockets = new Set<string>();
				onlineUsers.set(
					normalizedUserId,
					sockets,
				);
			}

			const wasAlreadyOnline = sockets.size > 0;

			sockets.add(socket.id);

			console.log(
				`User ${normalizedUserId} is online. Socket: ${socket.id}`,
			);

			// Only broadcast when this user actually became
			// online for the first time.
			if (!wasAlreadyOnline) {
				io.emit("userStatus", {
					userId: normalizedUserId,
					online: true,
				});
			}

			// Send the newly connected user the current
			// online status of all other users.
			for (const onlineUserId of onlineUsers.keys()) {
				if (onlineUserId === normalizedUserId) {
					continue;
				}

				socket.emit("userStatus", {
					userId: onlineUserId,
					online: true,
				});
			}
		});

		// JOIN CHAT

		socket.on(
			"joinChat",
			({
				userId,
				targetUserId,
			}: {
				userId: string;
				targetUserId: string;
			}) => {
				if (!userId || !targetUserId) return;

				const roomId = getRoomId(
					userId,
					targetUserId,
				);

				socket.join(roomId);

				console.log(
					`Socket ${socket.id} joined chat room ${roomId}`,
				);
			},
		);

		// LEAVE CHAT

		socket.on(
			"leaveChat",
			({
				userId,
				targetUserId,
			}: {
				userId: string;
				targetUserId: string;
			}) => {
				if (!userId || !targetUserId) return;

				const roomId = getRoomId(
					userId,
					targetUserId,
				);

				socket.leave(roomId);

				console.log(
					`Socket ${socket.id} left chat room ${roomId}`,
				);
			},
		);

		// SEND MESSAGE

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
				try {
					if (
						!text?.trim() ||
						!userId ||
						!targetUserId
					) {
						return;
					}

					const roomId = getRoomId(
						userId,
						targetUserId,
					);

					const message = {
						senderId: userId,
						text: text.trim(),
						seen: false,
					};

					let chat = await Chat.findOne({
						participants: {
							$all: [userId, targetUserId],
						},
					});

					if (!chat) {
						chat = new Chat({
							participants: [
								userId,
								targetUserId,
							],
							messages: [message],
							lastMessageAt: new Date(),
						});
					} else {
						chat.messages.push(message as any);
						chat.lastMessageAt =
							new Date();
					}

					await chat.save();

					const savedMessage =
						chat.messages.at(-1);

					if (!savedMessage) return;

					// Send message to everyone currently
					// inside this chat room.
					io.to(roomId).emit(
						"receiveMessage",
						savedMessage,
					);

					// Notify every socket/device of the receiver.
					const receiverSockets =
						onlineUsers.get(
							targetUserId.toString(),
						);

					if (receiverSockets) {
						for (const socketId of receiverSockets) {
							io.to(socketId).emit(
								"unreadCountUpdated",
							);
						}
					}
				} catch (error) {
					console.error(
						"Socket sendMessage error:",
						error,
					);
				}
			},
		);

		// MARK SEEN

		socket.on(
			"markSeen",
			async ({
				userId,
				targetUserId,
			}: {
				userId: string;
				targetUserId: string;
			}) => {
				try {
					if (!userId || !targetUserId) {
						return;
					}

					const roomId = getRoomId(
						userId,
						targetUserId,
					);

					const chat = await Chat.findOne({
						participants: {
							$all: [userId, targetUserId],
						},
					});

					if (!chat) return;

					let updated = false;

					chat.messages.forEach((msg) => {
						if (
							msg.senderId.toString() ===
								targetUserId &&
							msg.seen === false
						) {
							msg.seen = true;
							updated = true;
						}
					});

					if (!updated) return;

					await chat.save();

					// Tell both users in the current chat room
					// that messages have been seen.
					io.to(roomId).emit(
						"messagesSeen",
					);

					// Notify every socket/device of the user
					// whose unread count changed.
					const mySockets =
						onlineUsers.get(
							userId.toString(),
						);

					if (mySockets) {
						for (const socketId of mySockets) {
							io.to(socketId).emit(
								"unreadCountUpdated",
							);
						}
					}
				} catch (error) {
					console.error(
						"Socket markSeen error:",
						error,
					);
				}
			},
		);

		// DISCONNECT

		socket.on("disconnect", () => {
			console.log(
				"Socket disconnected:",
				socket.id,
			);

			for (const [
				userId,
				sockets,
			] of onlineUsers.entries()) {
				if (!sockets.has(socket.id)) {
					continue;
				}

				// Remove this particular socket.
				sockets.delete(socket.id);

				// User still has another tab/device open.
				if (sockets.size > 0) {
					console.log(
						`User ${userId} still has ${sockets.size} active socket(s).`,
					);

					break;
				}

				// No sockets left.
				// User is genuinely offline.
				onlineUsers.delete(userId);

				console.log(
					`User ${userId} is now offline.`,
				);

				io.emit("userStatus", {
					userId,
					online: false,
				});

				break;
			}
		});
	});

	return io;
};