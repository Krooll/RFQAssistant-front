export const Roles = {
  admin: 'ROLE_ADMIN',
  manager: 'ROLE_MANAGER',
  employee: 'ROLE_EMPLOYEE',
  supplier: 'ROLE_SUPPLIER',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export interface RolesInterface {
  label: string;
  labelFallback: string;
  role: Role;
}
