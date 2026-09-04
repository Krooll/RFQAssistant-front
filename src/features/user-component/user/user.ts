import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserService } from '@features/user-component/user-service';
import { HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from '@shared/shared-ui/button/button';

@Component({
  selector: 'app-user',
  imports: [Button],
  providers: [UserService],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class User implements OnInit {
  private readonly _userComponentService = inject(UserService);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
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
}
