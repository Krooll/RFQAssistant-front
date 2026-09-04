import { inject, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import {
  CreateUserRequest,
  PageRequestParams,
  SpringPageable,
  UpdateUserRequest,
  UserDto,
} from '@core/dtos';
import { Observable } from 'rxjs';
import { Endpoints } from '@env/endpoints';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class UserService {
  private readonly _baseHttpService = inject(BaseHttpService);

  public pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  public userList = signal<UserDto[] | undefined>(undefined);

  getUsers(
    pageParams: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<UserDto>> {
    return this._baseHttpService.getPageData(Endpoints.user, pageParams, extraPageParams);
  }

  getUserById(id: number): Observable<UserDto> {
    return this._baseHttpService.getPageDataById(Endpoints.user, id);
  }

  createUser(createUserRequest: CreateUserRequest): Observable<UserDto> {
    return this._baseHttpService.postData<UserDto, CreateUserRequest>(
      Endpoints.user,
      createUserRequest,
    );
  }

  updateUser(updateUserRequest: UpdateUserRequest): Observable<UserDto> {
    return this._baseHttpService.patchData<UserDto, UpdateUserRequest>(
      Endpoints.user,
      updateUserRequest,
    );
  }

  deleteUser(id: number) {
    return this._baseHttpService.deleteData(Endpoints.user, id);
  }

  showCreateUserModal() {}
}
