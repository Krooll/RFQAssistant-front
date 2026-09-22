export const ItemListActions = {
  info: 'info',
  delete: 'delete',
  document: 'document',
} as const;

export type ItemListAction = (typeof ItemListActions)[keyof typeof ItemListActions];
