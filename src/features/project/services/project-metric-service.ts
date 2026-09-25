import { Injectable, signal } from '@angular/core';
import { MetricsDto } from '@core/dtos';

@Injectable()
export class ProjectMetricService {
  public generatedMetricList = signal<MetricsDto[]>([]);
  public readonly percent = signal<number>(0);

  public generateMetricList(metricFormData: { metricsYears: number; metricsPercent: number }, sop: string): void {
    const startYear = parseInt(sop.substring(0, 4), 10);
    const count = metricFormData.metricsYears;

    this.percent.set(metricFormData.metricsPercent);

    this.generatedMetricList.set(
      Array.from({ length: count }, (_, i) => ({
        date: new Date(startYear + i, 0, 1).toISOString(),
        percent: this.percent(),
        basic: undefined,
        basicWithPercent: undefined,
      })),
    );
  }

  public updateMetric(index: number, value: number): void {
    const numValue = value === null || value === undefined ? undefined : value;

    this.generatedMetricList.update((list) => {
      const updated = [...list];
      const calculatedPercent =
        numValue !== undefined ? Math.round(numValue * (1 + this.percent() / 100) * 100) / 100 : undefined;

      updated[index] = {
        ...updated[index],
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
}
