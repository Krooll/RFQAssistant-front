import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { MetricsDto } from '@core/dtos';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-project-metrics',
  imports: [DatePipe, Button, TranslateFallbackPipe],
  templateUrl: './project-metrics.html',
  styleUrl: './project-metrics.scss',
})
export class ProjectMetrics {
  protected metricConfigButtonEmit = output<void>();
  protected metricDeleteButtonEmit = output<number>();
  protected metricUpdateButtonEmit = output<{ index: number; event: number }>();
  protected metricPasteButtonEmit = output<{ event: ClipboardEvent; index: number }>();

  protected deleteButtonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.transparent,
    size: ButtonSizes.small,
  };

  public generatedMetricList = input.required<MetricsDto[]>();
  public percent = input.required<number>();
  public isInputDisabled = input.required<boolean | undefined>();

  protected onMetricConfigButtonClick(): void {
    this.metricConfigButtonEmit.emit();
  }

  protected onUpdateMetricButtonClick(index: number, event: number): void {
    this.metricUpdateButtonEmit.emit({ index, event });
  }

  protected onPasteMetricButtonClick(event: ClipboardEvent, index: number): void {
    this.metricPasteButtonEmit.emit({ event, index });
  }

  protected onDeleteCurrentSingleTable(index: number): void {
    this.metricDeleteButtonEmit.emit(index);
  }
}
