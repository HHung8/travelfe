export interface PaymentMethodItem {
    id: string;
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
    createdAt: string;
}

export interface AddPaymentMethodRequest {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
}