import { apiClient } from "./ApiClient";

export interface CreateOrderPayload {
  membershipType: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export class PaymentService {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const res = await apiClient.post("/payment/create", payload);
    return res.data.data ?? res.data;
  }

  async verifyPremium(): Promise<{ isPremium: boolean; membershipType?: string }> {
    const res = await apiClient.get("/payment/premium/verify");
    return res.data.data ?? res.data;
  }
}

export const paymentService = new PaymentService();
