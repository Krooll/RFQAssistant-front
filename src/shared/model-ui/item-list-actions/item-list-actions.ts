export const ItemListActions = {
  info: 'info',
  delete: 'delete',
} as const;

export type ItemListAction = (typeof ItemListActions)[keyof typeof ItemListActions];
