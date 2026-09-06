import { inject, Injectable, Injector, signal } from '@angular/core';
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
import { ModalService } from '@core/services/modal-service/modal-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { UserModal } from '@features/user-component/user-modal/user-modal';

@Injectable()
export class UserService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);

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

  showCreateUserModal(injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<UserDto> = {
      type: 'create',
      title: 'MODALS.user.create',
      titleFallback: 'Dodaj nowego użytkownika',
    };

    this._modalService.openModal(UserModal, createModalConfiguration, { injector: injector });
  }

  showInfoUserModal(response: UserDto, injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<UserDto> = {
      type: 'info',
      title: 'MODALS.user.info',
      titleFallback: 'Więcej informacji',
      data: response,
    };

    this._modalService.openModal(UserModal, createModalConfiguration, { injector: injector });
  }

  showDeleteModal(injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<UserDto> = {
      type: 'delete',
      title: 'MODALS.user.delete',
      titleFallback: 'Usuń użytkownika',
    };

    this._modalService.openModal(UserModal, createModalConfiguration, { injector: injector });
  }

  closeCurrentModal() {
    this._modalService.closeCurrentModal();
  }
}
