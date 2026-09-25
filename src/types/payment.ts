export type BookingType  = "tour" | "hotel" | "attraction";

export interface CreatePaymentRequest {
  bookingType: BookingType;
  bookingId: string;
  amount: number;
  method: string;
}

export interface PaymentResult {
  id: string;
  userId: string;
  bookingType: BookingType;
  bookingId: string;
  amount: number;
  method: string;
  status: string;
  transactionRef: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface ConfirmPaymentRequest {
  transactionRef: string;
  gatewayResponse?: string;
}

export interface FailPaymentRequest {
  gatewayResponse?: string;
}