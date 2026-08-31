import { UserDto } from '@core/dtos';

export interface UserDataLocalStorage {
  user: UserDto;
  expiresIn: number;
  tokenType: string;
}
