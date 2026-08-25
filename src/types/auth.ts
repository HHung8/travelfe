export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  role: string;
};

export type AuthData = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
};

