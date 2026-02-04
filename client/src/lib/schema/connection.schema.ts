import { z } from "zod";

export const sendConnectionSchema = z.object({
  toUserId: z.string().min(1, 'User ID is required'),
  status: z.enum(['interested', 'ignored'], {
    error: 'Status must be either interested or ignored' }),
});

export const reviewConnectionSchema = z.object({
  requestId: z.string().min(1, 'Request ID is required'),
  status: z.enum(['accepted', 'rejected'], {
    error: 'Status must be either accepted or rejected' }),
  })

export const feedPaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

// Type exports
export type SendConnectionInput = z.infer<typeof sendConnectionSchema>;
export type ReviewConnectionInput = z.infer<typeof reviewConnectionSchema>;
export type FeedPaginationInput = z.infer<typeof feedPaginationSchema>;