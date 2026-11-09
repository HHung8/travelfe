import { ConfirmPaymentRequest, CreatePaymentRequest, FailPaymentRequest, PaymentResult } from "../types/payment";
import { postWithAuth } from "./api";

export type PaymentSimulationOutcome = "success" | "failure" | "cancel";

type SimulatedPaymentResult =
  | { outcome: "success"; payment: PaymentResult }
  | { outcome: "failure" | "cancel"; payment: null };

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
  await postWithAuth(`/payments/${id}/fail`, token, { ...payload });
}

export async function processDevelopmentPayment(
  token: string | null,
  paymentId: string,
  outcome: PaymentSimulationOutcome,
  method: string
): Promise<SimulatedPaymentResult> {
  if (!__DEV__) {
    throw new Error("Mô phỏng thanh toán chỉ dùng trong môi trường development");
  }

  const gatewayResponse = JSON.stringify({
    environment: "development",
    outcome,
    method,
  });

  if (outcome === "success") {
    const payment = await confirmPayment(token, paymentId, {
      transactionRef: `DEV-${Date.now()}`,
      gatewayResponse,
    });
    return { outcome, payment };
  }

  await failPayment(token, paymentId, { gatewayResponse });
  return { outcome, payment: null };
}
