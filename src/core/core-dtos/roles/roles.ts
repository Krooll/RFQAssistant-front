export const Roles = {
  admin: 'ROLE_ADMIN',
  user: 'ROLE_USER',
  manager: 'ROLE_MANAGER',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface RolesInterface {
  label: string;
  labelFallback: string;
  role: Role;
}
