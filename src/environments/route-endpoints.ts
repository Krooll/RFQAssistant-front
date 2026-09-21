export const RouteEndpoints = {
  dashboard: '/dashboard',
  user: '/dashboard/user',
  supplier: '/dashboard/supplier',
  process: '/dashboard/process',
  project: '/dashboard/project',
  projectForm: '/dashboard/project/form',
  projectEditForm: '/dashboard/project/edit/form/:id',
  component: '/dashboard/technical-specification',
  document: '/dashboard/document',
  unauthorized: '/dashboard/unauthorized',
  authLogin: '/auth/login',
  authRefresh: '/auth/refresh',
} as const;

export type RouteEndpoints = (typeof RouteEndpoints)[keyof typeof RouteEndpoints];
