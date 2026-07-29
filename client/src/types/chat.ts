import { z } from "zod";

/**
 * A single message. `senderId` normalizes to a plain string id whether
 * the backend sends it populated (`{ _id }`, from `/chat/:id` history)
 * or flat (a string, from the `receiveMessage` socket event) — see
 * `ChatService.getChatHistory`.
 */
export const chatMessageSchema = z.object({
  _id: z.string().optional(),
  senderId: z.string(),
  text: z.string(),
  createdAt: z.string().optional(),
  seen: z.boolean().optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

/** One row in the chat inbox list (`/chat/list`). */
export const chatListItemSchema = z.object({
  chatId: z.string(),
  user: z.object({
    _id: z.string(),
    firstName: z.string(),
    lastName: z.string().nullable().optional(),
    photo: z.string().nullable().optional(),
  }),
  lastMessage: z.string().nullable().optional(),
  lastMessageAt: z.string().nullable().optional(),
  unreadCount: z.number().default(0),
});

export type ChatListItem = z.infer<typeof chatListItemSchema>;
export const chatListSchema = z.array(chatListItemSchema);
