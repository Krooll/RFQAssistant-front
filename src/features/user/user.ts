import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UserService } from '@features/user/user-service';
import { PageRequestParams, UserDto } from '@core/dtos';
import { HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user',
  imports: [],
  providers: [UserService],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  private readonly _userComponentService = inject(UserService);
  private readonly _destroyRef = inject(DestroyRef);

  protected pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  protected userList = signal<UserDto[] | undefined>(undefined);

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this._userComponentService
      .getUsers(this.pageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (data) => {
          if (data) {
            this.userList.set(data.content);
          }
        },
      });
  }
}
