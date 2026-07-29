import { io, type Socket } from "socket.io-client";

import { env } from "@/lib/env";

interface RawSocketMessage {
  _id?: string;
  senderId: string;
  text: string;
  createdAt?: string;
}

interface ServerToClientEvents {
  receiveMessage: (message: RawSocketMessage) => void;
  messagesSeen: () => void;
  userStatus: (payload: { userId: string; online: boolean }) => void;
  unreadCountUpdated: () => void;
}

interface ClientToServerEvents {
  userOnline: (userId: string) => void;
  joinChat: (payload: { userId: string; targetUserId: string }) => void;
  leaveChat: (payload: { userId: string; targetUserId: string }) => void;
  sendMessage: (payload: { userId: string; targetUserId: string; text: string }) => void;
  markSeen: (payload: { userId: string; targetUserId: string }) => void;
}

/**
 * Thin wrapper around socket.io-client so the rest of the app never
 * imports `socket.io-client` directly. One instance is shared for the
 * whole session (created lazily on first use, torn down on logout).
 */
export class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  connect(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.socket) {
      this.socket = io(env.socketUrl, { withCredentials: true });
    }
    return this.socket;
  }

  announceOnline(userId: string) {
    this.connect().emit("userOnline", userId);
  }

  joinChat(userId: string, targetUserId: string) {
    this.connect().emit("joinChat", { userId, targetUserId });
  }

  leaveChat(userId: string, targetUserId: string) {
    this.socket?.emit("leaveChat", { userId, targetUserId });
  }

  sendMessage(userId: string, targetUserId: string, text: string) {
    this.connect().emit("sendMessage", { userId, targetUserId, text });
  }

  markSeen(userId: string, targetUserId: string) {
    this.connect().emit("markSeen", { userId, targetUserId });
  }

  onReceiveMessage(handler: ServerToClientEvents["receiveMessage"]) {
    this.connect().on("receiveMessage", handler);
    return () => this.socket?.off("receiveMessage", handler);
  }

  onMessagesSeen(handler: ServerToClientEvents["messagesSeen"]) {
    this.connect().on("messagesSeen", handler);
    return () => this.socket?.off("messagesSeen", handler);
  }

  onUserStatus(handler: ServerToClientEvents["userStatus"]) {
    this.connect().on("userStatus", handler);
    return () => this.socket?.off("userStatus", handler);
  }

  onUnreadCountUpdated(handler: ServerToClientEvents["unreadCountUpdated"]) {
    this.connect().on("unreadCountUpdated", handler);
    return () => this.socket?.off("unreadCountUpdated", handler);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
