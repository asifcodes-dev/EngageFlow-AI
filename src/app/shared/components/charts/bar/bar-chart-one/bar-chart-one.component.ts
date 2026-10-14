import { Component, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';
import { NgApexchartsModule } from 'ng-apexcharts';

/** Aurora blue ramp — bars are tinted by relative height (reference artboard). */
const BAR_RAMP = ['#c8daf0', '#8fb4dd', '#4a7fbd', '#1a5dab'];

/**
 * Aurora "Activity by day" bar chart (Insights reference): rounded-top bars in
 * graded blues (taller = deeper blue), no gridlines or y-axis — only muted
 * x labels, per the artboard.
 */
@Component({
  selector: 'app-bar-chart-one',
  imports: [NgApexchartsModule],
  templateUrl: './bar-chart-one.component.html',
  styles: ``,
})
export class BarChartOneComponent {
  // Defaults keep the standalone demo working; callers (Insights) pass real data.
  private seriesValue: ApexAxisChartSeries = [
    {
      name: 'Actions',
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  @Input() set series(value: ApexAxisChartSeries) {
    this.seriesValue = value;
    this.colors = rampColors(value);
  }
  get series(): ApexAxisChartSeries {
    return this.seriesValue;
  }

  /** Override the x-axis labels (no-op when empty so the demo defaults stay). */
  @Input() set categories(values: string[] | undefined) {
    if (values && values.length) {
      this.xaxis = { ...this.xaxis, categories: values };
    }
  }

  /** Print each bar's value above it (Admin Feature Analytics reference). Off by default so Insights is unaffected. */
  @Input() set showValueLabels(on: boolean) {
    this.dataLabels = on
      ? {
          enabled: true,
          offsetY: -18,
          style: { fontSize: '12px', fontWeight: 700, colors: ['#374151'] },
          formatter: (val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`),
        }
      : { enabled: false };
  }

  public chart: ApexChart = {
    fontFamily: 'DM Sans, sans-serif',
    type: 'bar',
    height: 200,
    toolbar: { show: false },
  };

  public colors: string[] = rampColors(this.seriesValue);

  public plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '70%',
      borderRadius: 3,
      borderRadiusApplication: 'end',
      distributed: true,
    },
  };

  public dataLabels: ApexDataLabels = { enabled: false };

  public stroke: ApexStroke = {
    show: true,
    width: 2,
    colors: ['transparent'],
  };

  public xaxis: ApexXAxis = {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { fontSize: '11px', colors: '#8894a8' },
      rotate: 0,
      hideOverlappingLabels: true,
    },
    tickAmount: 3,
  };

  public yaxis: ApexYAxis = {
    show: false,
  };

  public legend: ApexLegend = { show: false };

  public grid: ApexGrid = {
    show: false,
    padding: { left: 4, right: 4 },
  };

  public fill: ApexFill = { opacity: 1 };

  public tooltip: ApexTooltip = {
    x: { show: false },
    y: { formatter: (val: number) => `${val}` },
  };
}

/** Tint each bar by its relative height across the series (quartiles). */
function rampColors(series: ApexAxisChartSeries): string[] {
  const data = (series?.[0]?.data ?? []) as number[];
  const max = Math.max(...data.map((v) => Number(v) || 0), 1);
  return data.map((v) => {
    const ratio = (Number(v) || 0) / max;
    if (ratio > 0.85) return BAR_RAMP[3];
    if (ratio > 0.65) return BAR_RAMP[2];
    if (ratio > 0.45) return BAR_RAMP[1];
    return BAR_RAMP[0];
  });
}
