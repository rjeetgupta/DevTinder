import { z } from "zod";

export const chatMessageSchema = z.object({
  _id: z.string().optional(),
  senderId: z.string(),
  text: z.string(),
  createdAt: z.string().optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatHistorySchema = z.object({
  messages: z.array(chatMessageSchema),
});

/** One row in the chat inbox list (`/chat/list`). */
export const chatListItemSchema = z.object({
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  lastMessage: z.string().nullable().optional(),
  lastMessageAt: z.string().nullable().optional(),
  unreadCount: z.number().default(0),
});

export type ChatListItem = z.infer<typeof chatListItemSchema>;
export const chatListSchema = z.array(chatListItemSchema);
