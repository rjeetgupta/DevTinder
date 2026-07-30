import { z } from "zod";

/** Only "silver" is purchasable today; "gold" is a disabled "coming soon" plan in the UI. */
export const membershipTypeSchema = z.enum(["silver", "gold"]);
export type MembershipType = z.infer<typeof membershipTypeSchema>;

/**
 * `/payment/create` returns these fields directly on the response body
 * (no `data` wrapper), including a `notes` object used to prefill the
 * Razorpay checkout form.
 */
export const createOrderResponseSchema = z.object({
  keyId: z.string(),
  amount: z.number(),
  currency: z.string(),
  orderId: z.string(),
  notes: z.object({
    firstName: z.string(),
    lastName: z.string().optional(),
    emailId: z.string(),
  }),
});
export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;
