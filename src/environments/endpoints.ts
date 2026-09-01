export const Endpoints = {
  user: '/user',
  supplier: '/supplier',
  process: '/process',
  project: '/project',
  component: '/component',
  authLogin: '/auth/login',
  authRefresh: '/auth/refresh',
} as const;

export type Endpoint = (typeof Endpoints)[keyof typeof Endpoints];
