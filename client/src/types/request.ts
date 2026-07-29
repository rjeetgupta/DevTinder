import { z } from "zod";

import { userSchema } from "./user";

/**
 * Status values the backend accepts. Note `"intrested"` is a pre-existing
 * typo in the backend's `/request/send/:status/:id` route — kept as-is
 * since "fixing" it here would break real requests.
 */
export const sendStatusSchema = z.enum(["intrested", "ignored"]);
export type SendStatus = z.infer<typeof sendStatusSchema>;

export const reviewStatusSchema = z.enum(["accepted", "rejected"]);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const requestStatusSchema = z.enum(["intrested", "ignored", "accepted", "rejected"]);
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
