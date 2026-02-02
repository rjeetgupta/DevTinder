import { StateCreator } from 'zustand';
import { paymentAPI, CreateOrderInput, VerifyPaymentInput } from '@/api/payment.api';
import { Payment } from '@/types/user.types';

export interface PaymentSlice {
  // State
  paymentHistory: Payment[];
  isLoadingPayment: boolean;
  paymentError: string | null;

  // Actions
  createOrder: (membershipType: 'premium_monthly' | 'premium_yearly') => Promise<any>;
  verifyPayment: (data: VerifyPaymentInput) => Promise<void>;
  fetchPaymentHistory: () => Promise<void>;
  clearPaymentError: () => void;
}

export const createPaymentSlice: StateCreator<
  PaymentSlice,
  [],
  [],
  PaymentSlice
> = (set) => ({
  // Initial state
  paymentHistory: [],
  isLoadingPayment: false,
  paymentError: null,

  // Create Razorpay order
  createOrder: async (membershipType) => {
    set({ isLoadingPayment: true, paymentError: null });
    
    try {
      const data: CreateOrderInput = {
        membershipType,
      };
      
      const order = await paymentAPI.createOrder(data);
      
      set({ isLoadingPayment: false });
      return order;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      set({
        isLoadingPayment: false,
        paymentError: errorMessage,
      });
      throw error;
    }
  },

  // Verify payment after Razorpay callback
  verifyPayment: async (data) => {
    set({ isLoadingPayment: true, paymentError: null });
    
    try {
      const response = await paymentAPI.verifyPayment(data);
      
      // Update user premium status in auth slice
      // This would need to be handled in the combined store
      
      set({ isLoadingPayment: false });
      return response as any;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Payment verification failed';
      set({
        isLoadingPayment: false,
        paymentError: errorMessage,
      });
      throw error;
    }
  },

  // Fetch payment history
  fetchPaymentHistory: async () => {
    set({ isLoadingPayment: true, paymentError: null });
    
    try {
      const history = await paymentAPI.getPaymentHistory();
      
      set({
        paymentHistory: history,
        isLoadingPayment: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch payment history';
      set({
        isLoadingPayment: false,
        paymentError: errorMessage,
      });
      throw error;
    }
  },

  // Clear error
  clearPaymentError: () => set({ paymentError: null }),
});