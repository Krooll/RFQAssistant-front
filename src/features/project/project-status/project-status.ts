export const ProjectStatuses = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
  suspended: 'SUSPENDED',
} as const;

export type ProjectStatus = (typeof ProjectStatuses)[keyof typeof ProjectStatuses];
