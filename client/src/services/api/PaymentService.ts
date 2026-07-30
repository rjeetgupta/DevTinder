import { apiClient } from "./ApiClient";
import { createOrderResponseSchema, type CreateOrderResponse, type MembershipType } from "@/types";

export class PaymentService {
  /** Backend expects `memberShipType` (capital S — matches the pre-existing typo elsewhere). */
  async createOrder(membershipType: MembershipType): Promise<CreateOrderResponse> {
    const res = await apiClient.post("/payment/create", { memberShipType: membershipType });
    return createOrderResponseSchema.parse(res.data);
  }

  /** Also a POST, and returns `{ isPremium }` directly (no `data` wrapper). */
  async verifyPremium(): Promise<boolean> {
    const res = await apiClient.post("/payment/premium/verify", {});
    return Boolean(res.data.isPremium);
  }
}

export const paymentService = new PaymentService();
