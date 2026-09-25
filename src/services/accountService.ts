import { ChangePasswordRequest, NotificationPreferences, UpdateProfileRequest } from "../types/account";
import { deleteWithAuth, getWithAuth, putWithAuth } from "./api";

export async function updateProfile(token: string | null, payload: UpdateProfileRequest) {
    const res = await putWithAuth("/account/profile", token, payload as unknown as Record<string, unknown>);
    return res.data;
}

export async function changePassword(token: string | null, payload: ChangePasswordRequest): Promise<void> {
  await putWithAuth("/account/password", token, payload as unknown as Record<string, unknown>);
}

export async function deleteAccount(token: string | null): Promise<void> {
  await deleteWithAuth("/account", token);
}

export async function getNotificationPreferences(token: string | null): Promise<NotificationPreferences> {
  const res = await getWithAuth<NotificationPreferences>("/account/notification-preferences", token);
  return res.data ?? { pushEnabled: true, emailEnabled: false };
}

export async function setNotificationPreferences(token: string | null, payload: NotificationPreferences): Promise<void> {
  await putWithAuth("/account/notification-preferences", token, payload as unknown as Record<string, unknown>);
}