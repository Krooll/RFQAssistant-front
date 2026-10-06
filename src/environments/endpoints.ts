export const Endpoints = {
  user: '/user',
  supplier: '/supplier',
  process: '/process',
  project: '/project',
  material: '/material',
  component: '/component',
  document: '/document',
  documentUpload: '/document/upload',
  documentDownload: '/document/:id/download',
  documentPreview: '/document/preview',
  authLogin: '/auth/login',
  authRefresh: '/auth/refresh',
  activationUser: '/user/activation-user',
  activateUser: '/user/activate-user',
} as const;

export type Endpoint = (typeof Endpoints)[keyof typeof Endpoints];
