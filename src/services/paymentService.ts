import { CreatePaymentRequest, PaymentResult } from "../types/payment";
import { postWithAuth } from "./api";

export async function createPayment(
  token: string | null,
  payload: CreatePaymentRequest
): Promise<PaymentResult> {
  const res = await postWithAuth<PaymentResult>("/payments", token, {...payload});
  if (!res.data) throw new Error("Không tạo được giao dịch thanh toán");
  return res.data;
}