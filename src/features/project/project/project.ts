import { Component, inject, Injector, OnInit } from '@angular/core';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ProjectService } from '@features/project/services/project-service';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';
import { Table } from '@shared/shared-ui/table/table';

@Component({
  selector: 'app-project',
  imports: [Button, TranslateFallbackPipe, Table],
  providers: [ProjectService],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project implements OnInit {
  protected readonly _projectComponentService = inject(ProjectService);
  private readonly _injector = inject(Injector);

  ngOnInit() {
    this._projectComponentService.getAllProjects();
  }

  protected onAddButtonClicked(): void {
    this._projectComponentService.showCreateProjectModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined): void {
    this._projectComponentService.routeToCurrentProject(id);
  }

  protected onDeleteButtonCLicked(id: number | undefined): void {
    this._projectComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
