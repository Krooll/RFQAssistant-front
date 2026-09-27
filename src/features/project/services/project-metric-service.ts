import { inject, Injectable, signal } from '@angular/core';
import { MetricsDto } from '@core/dtos';
import { NotificationService } from '@core/services/notification-service/notification-service';

@Injectable()
export class ProjectMetricService {
  private readonly _notificationService = inject(NotificationService);

  public generatedMetricList = signal<MetricsDto[]>([]);
  public readonly percent = signal<number>(0);

  public generateMetricList(
    metricFormData: { metricsYears: number; metricsPercent: number },
    sop: string,
    currentMetricList: MetricsDto[] | undefined,
  ): void {
    const metricList = currentMetricList;
    const startYear = parseInt(sop.substring(0, 4), 10);
    const count = metricFormData.metricsYears;
    this.percent.set(metricFormData.metricsPercent);

    if (metricList && count < metricList?.length) {
      this._notificationService.showWarning('Liczba lat nie może być mniejsza niż aktualna liczba.');
      return;
    }

    const newMetricList: MetricsDto[] = Array.from({ length: count }, (_, i) => {
      const yearDate = new Date(startYear + i, 0, 1).toISOString();
      const existingMetric = currentMetricList?.[i];

      if (existingMetric && existingMetric.basic !== undefined) {
        const calculatedPercent = Math.round(existingMetric.basic * (1 + this.percent() / 100) * 100) / 100;

        return {
          ...existingMetric,
          date: yearDate,
          percent: this.percent(),
          basicWithPercent: calculatedPercent,
        };
      }
      return {
        date: yearDate,
        percent: this.percent(),
        basic: undefined,
        basicWithPercent: undefined,
      };
    });

    this.generatedMetricList.set(newMetricList);
  }

  public updateMetric(event: { index: number; event: number }): void {
    const numValue = event.event === null || event.event === undefined ? undefined : event.event;

    this.generatedMetricList.update((list) => {
      const updated = [...list];
      const calculatedPercent =
        numValue !== undefined ? Math.round(numValue * (1 + this.percent() / 100) * 100) / 100 : undefined;

      updated[event.index] = {
        ...updated[event.index],
        basic: numValue,
        basicWithPercent: calculatedPercent,
      };

      return updated;
    });
  }

  public pasteMetrics(startIndex: number, clipboardText: string): void {
    const pastedValues = clipboardText
      .split(/[\t\r\n]+/)
      .map((v) => v.trim())
      .filter((v) => v !== '');

    if (pastedValues.length === 0) return;

    this.generatedMetricList.update((currentList) => {
      const updated = [...currentList];

      for (let offset = 0; offset < pastedValues.length; offset++) {
        const targetIndex = startIndex + offset;
        if (targetIndex >= updated.length) break;
        const cleanString = pastedValues[offset].replace(/[\s\u00a0]/g, '').replace(',', '.');
        const parsed = parseFloat(cleanString);
        if (isNaN(parsed)) continue;

        const calculatedPercent = Math.round(parsed * (1 + this.percent() / 100));

        updated[targetIndex] = {
          ...updated[targetIndex],
          basic: parsed,
          basicWithPercent: calculatedPercent,
        };
      }
      return updated;
    });
  }

  deleteCurrentMetric(index: number): void {
    this.generatedMetricList.update((metrics) => metrics.filter((_, i) => i !== index));
  }
}
