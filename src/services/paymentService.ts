import { ConfirmPaymentRequest, CreatePaymentRequest, FailPaymentRequest, PaymentResult } from "../types/payment";
import { postWithAuth } from "./api";

export async function createPayment(
  token: string | null,
  payload: CreatePaymentRequest
): Promise<PaymentResult> {
  const res = await postWithAuth<PaymentResult>("/payments", token, {...payload});
  if (!res.data) throw new Error("Không tạo được giao dịch thanh toán");
  return res.data;
}

export async function confirmPayment(
  token: string | null,
  id: string,
  payload: ConfirmPaymentRequest
): Promise<PaymentResult> {
  const res = await postWithAuth<PaymentResult>(`/payments/${id}/confirm`, token, {...payload});
  if (!res.data) throw new Error("Không xác nhận được thanh toán");
  return res.data;
}

export async function failPayment(
  token: string | null,
  id: string,
  payload: FailPaymentRequest
): Promise<void> {
  await postWithAuth(`/payments/${id}/fail`, token, {...payload});
}