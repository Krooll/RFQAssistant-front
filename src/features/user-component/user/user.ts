import { Component, inject, Injector, OnInit } from '@angular/core';
import { UserService } from '@features/user-component/user-service';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';
import { Table } from '@shared/shared-ui/table/table';

@Component({
  selector: 'app-user',
  imports: [Button, TranslateFallbackPipe, Table],
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
