import { Endpoint } from '@env/endpoints';

export interface Application {
  id: string;
  name: string;
  nameFallback: string;
  route: Endpoint;
  expectedRole: string;
}
