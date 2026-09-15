export type Roles = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_USER';

export interface RolesInterface {
  label: string;
  labelFallback: string;
  role: Roles;
}
