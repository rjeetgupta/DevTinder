import { io, type Socket } from "socket.io-client";

import { env } from "@/lib/env";
import type { ChatMessage } from "@/types";

interface ServerToClientEvents {
  messageReceived: (message: ChatMessage & { targetUserId: string }) => void;
}

interface ClientToServerEvents {
  joinChat: (payload: { userId: string; targetUserId: string }) => void;
  sendMessage: (payload: { userId: string; targetUserId: string; text: string }) => void;
}

/**
 * Thin wrapper around socket.io-client so the rest of the app never
 * imports `socket.io-client` directly. One instance is created per app
 * session by chatSlice (Module 8) when the chat page mounts.
 */
export class SocketService {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

  connect(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!this.socket) {
      this.socket = io(env.socketUrl, { withCredentials: true });
    }
    return this.socket;
  }

  joinChat(userId: string, targetUserId: string) {
    this.connect().emit("joinChat", { userId, targetUserId });
  }

  sendMessage(userId: string, targetUserId: string, text: string) {
    this.connect().emit("sendMessage", { userId, targetUserId, text });
  }

  onMessageReceived(handler: ServerToClientEvents["messageReceived"]) {
    this.connect().on("messageReceived", handler);
    return () => this.socket?.off("messageReceived", handler);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
