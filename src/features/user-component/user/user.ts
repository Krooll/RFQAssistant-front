import { Component, inject, Injector, OnInit } from '@angular/core';
import { UserService } from '@features/user-component/user-service';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Paginator } from '@shared/shared-ui/paginator/paginator';
import { ItemList } from '@shared/shared-ui/item-list/item-list';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-user',
  imports: [Button, TranslateFallbackPipe, Paginator, ItemList],
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

  protected onAddButtonClicked(): void {
    this._userComponentService.showCreateUserModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined): void {
    this._userComponentService.getCurrentUserById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined): void {
    this._userComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
