import { Component, inject, Injector, OnInit } from '@angular/core';
import { UserService } from '@features/user-component/user-service';
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

  ngOnInit() {
    this._userComponentService.getAllUsers();
  }

  protected onAddButtonClicked() {
    this._userComponentService.showCreateUserModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined) {
    this._userComponentService.getCurrentUserById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined) {
    this._userComponentService.showDeleteModal(id, this._injector);
  }
}
