// src/modules/auth/interfaces/google-tokens.interface.ts
export interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

export interface GoogleTokensWithUser extends GoogleTokens {
  userId: number;
  userEmail: string;
}
