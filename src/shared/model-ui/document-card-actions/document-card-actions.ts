export const documentCardActions = {
  delete: 'delete',
  download: 'download',
  preview: 'preview',
} as const;

export type DocumentCardAction = (typeof documentCardActions)[keyof typeof documentCardActions];
