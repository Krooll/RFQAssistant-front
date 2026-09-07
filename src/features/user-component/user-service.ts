import { DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import {
  CreateUserRequest,
  PageRequestParams,
  SpringPageable,
  UpdateUserRequest,
  UserDto,
} from '@core/dtos';
import { Observable } from 'rxjs';
import { Endpoint, Endpoints } from '@env/endpoints';
import { HttpParams } from '@angular/common/http';
import { ModalService } from '@core/services/modal-service/modal-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { UserModal } from '@features/user-component/user-modal/user-modal';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class UserService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  public totalElements = signal<number>(0);
  public userList = signal<UserDto[] | undefined>(undefined);

  private getUsers(
    pageParams: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<UserDto>> {
    return this._baseHttpService.getPageData(Endpoints.user, pageParams, extraPageParams);
  }

  private getUserById(id: number): Observable<UserDto> {
    return this._baseHttpService.getPageDataById(Endpoints.user, id);
  }

  public createUser(createUserRequest: CreateUserRequest): Observable<UserDto> {
    return this._baseHttpService.postData<UserDto, CreateUserRequest>(
      Endpoints.user,
      createUserRequest,
    );
  }

  public updateUser(updateUserRequest: UpdateUserRequest): Observable<UserDto> {
    return this._baseHttpService.patchData<UserDto, UpdateUserRequest>(
      Endpoints.user,
      updateUserRequest,
    );
  }

  public getAllUsers() {
    this.getUsers(this.pageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          if (data) {
            this.userList.set(data.content);
            console.log(data.totalElements);
            this.totalElements.set(data.totalElements);
          }
        },
      });
  }

  updatePageParams(params: PageRequestParams) {
    this.pageParams.set(params);
    this.getAllUsers();
  }

  public getCurrentUserById(id: number | undefined, injector: Injector) {
    if (id) {
      this.getUserById(id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response) => {
            if (response) {
              this.showInfoUserModal(response, injector);
            }
          },
        });
    }
  }

  showCreateUserModal(injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<UserDto> = {
      type: 'create',
      title: 'MODALS.user.create',
      titleFallback: 'Dodaj nowego użytkownika',
    };

    this._modalService
      .openModal(UserModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllUsers();
          }
        },
      });
  }

  showInfoUserModal(response: UserDto, injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<UserDto> = {
      type: 'info',
      title: 'MODALS.user.info',
      titleFallback: 'Więcej informacji',
      data: response,
    };

    this._modalService
      .openModal(UserModal, createModalConfiguration, { injector: injector })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllUsers();
          }
        },
      });
  }

  showDeleteModal(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: 'delete',
      title: 'MODALS.user.delete',
      titleFallback: 'Usuń użytkownika',
      data: { id: id, endpoint: Endpoints.user },
    };

    this._modalService
      .openModal(DeleteModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllUsers();
          }
        },
      });
  }

  closeCurrentModal(reloadPage?: boolean) {
    this._modalService.closeCurrentModal(reloadPage);
  }
}
