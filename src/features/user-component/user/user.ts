import { Component, DestroyRef, inject, Injector, OnInit } from '@angular/core';
import { UserService } from '@features/user-component/user-service';
import { HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-user',
  imports: [Button, TranslateFallbackPipe],
  providers: [UserService],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  protected readonly _userComponentService = inject(UserService);
  private readonly _injector = inject(Injector);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getAllUsers();
  }

  private getAllUsers() {
    this._userComponentService
      .getUsers(this._userComponentService.pageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          if (data) {
            this._userComponentService.userList.set(data.content);
          }
        },
      });
  }

  protected onAddButtonClicked() {
    this._userComponentService.showCreateUserModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined) {
    if (id) {
      this._userComponentService
        .getUserById(id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (response) => {
            if (response) {
              this._userComponentService.showInfoUserModal(response, this._injector);
            }
          },
        });
    }
  }

  protected onDeleteButtonCLicked(id: number | undefined) {
    this._userComponentService.showDeleteModal(this._injector);
  }
}
