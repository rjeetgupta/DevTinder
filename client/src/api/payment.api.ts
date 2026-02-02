import { z } from 'zod';
import axiosInstance from './axios';
import { Payment } from '@/types/user.types';

// Validation Schemas
export const createOrderSchema = z.object({
  membershipType: z.enum(['premium_monthly', 'premium_yearly'], {
    error: 'Invalid membership type' }),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
});

// Type exports
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

// API Response types
export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  payment: Payment;
  membership: {
    isPremium: boolean;
    membershipType: string;
    membershipValidity: Date;
  };
}

// API Functions
class PaymentAPI {
  // Create Razorpay order
  async createOrder(data: unknown) {
    const validatedData = createOrderSchema.parse(data);
    
    const response = await axiosInstance.post<RazorpayOrder>(
      '/payment/create-order',
      validatedData
    );
    
    return response.data;
  }

  // Verify payment after Razorpay callback
  async verifyPayment(data: unknown) {
    const validatedData = verifyPaymentSchema.parse(data);
    
    const response = await axiosInstance.post<PaymentVerificationResponse>(
      '/payment/verify',
      validatedData
    );
    
    return response.data;
  }

  // Get payment history
  async getPaymentHistory() {
    const response = await axiosInstance.get<Payment[]>('/payment/history');
    return response.data;
  }

  // Get current subscription details
  async getSubscriptionDetails() {
    const response = await axiosInstance.get<{
      isPremium: boolean;
      membershipType?: string;
      membershipValidity?: Date;
      autoRenew: boolean;
    }>('/payment/subscription');
    
    return response.data;
  }

  // Cancel subscription (if supported)
  async cancelSubscription() {
    const response = await axiosInstance.post<{
      success: boolean;
      message: string;
    }>('/payment/cancel-subscription');
    
    return response.data;
  }
}

export const paymentAPI = new PaymentAPI();