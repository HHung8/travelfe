export interface UpdateProfileRequest {
    fullName?: string;
    phone?: string;
    avatarUrl?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface NotificationPreferences {
    pushEnabled: boolean;
    emailEnabled: boolean;
}