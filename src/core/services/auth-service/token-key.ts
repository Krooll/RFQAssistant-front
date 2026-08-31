export const TokenKeys = {
  auth_token: 'auth_token',
} as const;

export type TokenKey = (typeof TokenKeys)[keyof typeof TokenKeys];
