import { Component, inject, OnInit } from '@angular/core';
import { Button } from '@shared/shared-ui/button/button';
import { Paginator } from '@shared/shared-ui/paginator/paginator';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ProjectService } from '@features/project/project-service';
import { ItemList } from '@shared/shared-ui/item-list/item-list';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-project',
  imports: [Button, Paginator, TranslateFallbackPipe, ItemList],
  providers: [ProjectService],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project implements OnInit {
  protected readonly _projectComponentService = inject(ProjectService);

  ngOnInit() {
    this._projectComponentService.getAllProjects();
  }

  protected onAddButtonClicked() {
    //this._projectComponentService.showCreateUserModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined) {
    //this._projectComponentService.getCurrentUserById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined) {
    //this._projectComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
