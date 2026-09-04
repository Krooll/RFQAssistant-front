import { RouteEndpoints } from '@env/route-endpoints';

export interface Application {
  id: string;
  name: string;
  nameFallback: string;
  route: RouteEndpoints;
  expectedRole: string;
}
