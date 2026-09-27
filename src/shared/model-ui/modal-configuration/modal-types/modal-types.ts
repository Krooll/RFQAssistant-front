export const ModalTypes = {
  create: 'create',
  update: 'update',
  delete: 'delete',
  info: 'info',
} as const;

export type ModalType = (typeof ModalTypes)[keyof typeof ModalTypes];
