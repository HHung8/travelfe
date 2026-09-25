import { AddPaymentMethodRequest, PaymentMethodItem } from "../types/paymentMethod";
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "./api";

export async function getPaymentMethods(token: string | null): Promise<PaymentMethodItem[]> {
    const res = await getWithAuth<PaymentMethodItem[]>("/payment-methods", token)    
    return res.data ?? [];
};

export async function addPaymentMethod(token: string | null, payload: AddPaymentMethodRequest) : Promise<PaymentMethodItem> {
    const res = await postWithAuth<PaymentMethodItem>("/payment-methods", token, payload as unknown as Record<string, unknown>);
    console.log(`check res`, res);
    if(!res.data) throw new Error("Không thêm được thẻ");
    return res.data;
}


export async function setDefaultPaymentMethod(token: string | null, id:string):Promise<void> {
    await putWithAuth(`/payment-methods/${id}/default`, token, {});
}

export async function deletePaymentMethod(token: string | null, id:string):Promise<void> {
    await deleteWithAuth(`/payment-methods/${id}`, token);
}



