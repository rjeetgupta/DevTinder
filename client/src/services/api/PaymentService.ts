import { apiClient, extractErrorMessage } from "./ApiClient";
import type { MembershipType } from "@/types";

/**
 * No user-typed input here (membershipType is a fixed enum selection,
 * not free-form form input) — so no Zod validation step needed beyond
 * TypeScript's own enum typing. Response returned as-is.
 */
export class PaymentService {
  /** Backend expects `memberShipType` (capital S — matches the pre-existing typo elsewhere). */
  async createOrder(membershipType: MembershipType) {
    try {
      const res = await apiClient.post("/payment/create", { memberShipType: membershipType });
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to start checkout. Please try again."));
    }
  }

  async verifyPremium() {
    try {
      const res = await apiClient.post("/payment/premium/verify", {});
      return res.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error, "Unable to verify payment. Please try again."));
    }
  }
}

export const paymentService = new PaymentService();