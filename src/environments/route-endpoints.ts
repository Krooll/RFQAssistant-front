export const RouteEndpoints = {
  dashboard: '/dashboard',
  user: '/dashboard/user',
  supplier: '/dashboard/supplier',
  process: '/dashboard/process',
  project: '/dashboard/project',
  component: '/dashboard/project-component',
  unauthorized: '/dashboard/unauthorized',
  authLogin: '/auth/login',
  authRefresh: '/auth/refresh',
} as const;

export type RouteEndpoints = (typeof RouteEndpoints)[keyof typeof RouteEndpoints];
