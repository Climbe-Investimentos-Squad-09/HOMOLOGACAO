// src/types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    googleTokens?: {
      access_token: string;
      refresh_token: string;
      scope: string;
      token_type: string;
      expiry_date: number;
    };
    userId?: number;
  }
}