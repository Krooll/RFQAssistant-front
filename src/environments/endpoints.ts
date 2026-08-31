export const Endpoints = {
  user: '/user',
  supplier: '/supplier',
  process: '/process',
  project: '/project',
  component: '/component',
} as const;

export type Endpoint = (typeof Endpoints)[keyof typeof Endpoints];
