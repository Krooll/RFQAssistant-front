export const RouteEndpoints = {
  dashboard: '/dashboard',
  user: '/dashboard/user',
  supplier: '/dashboard/supplier',
  process: '/dashboard/process',
  project: '/dashboard/project',
  material: '/dashboard/material',
  projectForm: '/dashboard/project/form',
  component: '/dashboard/technical-specification',
  document: '/dashboard/document',
  unauthorized: '/unauthorized',
  authLogin: '/auth/login',
  authRefresh: '/auth/refresh',
  activateAccount: '/activate-user',
} as const;

export type RouteEndpoints = (typeof RouteEndpoints)[keyof typeof RouteEndpoints];
