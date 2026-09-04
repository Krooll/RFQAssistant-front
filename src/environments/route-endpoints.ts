export const RouteEndpoints = {
  dashboard: '/dashboard-component',
  user: '/dashboard-component/user',
  supplier: '/dashboard-component/supplier-component',
  process: '/dashboard-component/process-component',
  project: '/dashboard-component/project',
  component: '/dashboard-component/technical-specification-component',
  unauthorized: '/dashboard-component/unauthorized-component',
  authLogin: '/auth/login',
  authRefresh: '/auth/refresh',
} as const;

export type RouteEndpoints = (typeof RouteEndpoints)[keyof typeof RouteEndpoints];
