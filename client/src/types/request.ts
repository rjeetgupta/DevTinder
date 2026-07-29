import { z } from "zod";

import { userSchema } from "./user";

/** Status values the backend accepts for `/request/send/:status/:id` and `/request/review/:status/:id`. */
export const requestStatusSchema = z.enum(["interested", "ignored", "accepted", "rejected"]);
export type RequestStatus = z.infer<typeof requestStatusSchema>;

/**
 * A connection request document, populated with the other user
 * (`fromUserId` on the received-requests endpoint, `toUserId` on sent).
 */
export const connectionRequestSchema = z.object({
  _id: z.string(),
  status: requestStatusSchema,
  fromUserId: userSchema.optional(),
  toUserId: userSchema.optional(),
  createdAt: z.string().optional(),
});

export type ConnectionRequest = z.infer<typeof connectionRequestSchema>;

export const connectionRequestListSchema = z.array(connectionRequestSchema);
