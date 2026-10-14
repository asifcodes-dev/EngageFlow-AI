import { Component, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexFill,
  ApexMarkers,
  ApexGrid,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';

/**
 * Aurora "Engagement over time" area chart (Insights reference): primary series
 * drawn as a #1a5dab line over a soft 8% blue area; secondary series a light
 * #a9c6e8 line. No gridlines or y-axis — only muted x labels, per the artboard.
 */
@Component({
  selector: 'app-line-chart-one',
  imports: [NgApexchartsModule],
  templateUrl: './line-chart-one.component.html',
  styles: ``,
})
export class LineChartOneComponent {
  // Defaults keep the standalone demo working; callers (Insights) pass real data.
  @Input() series: ApexAxisChartSeries = [
    {
      name: 'Replies',
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: 'Actions',
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ];

  /** Override the x-axis labels (no-op when empty so the demo defaults stay). */
  @Input() set categories(values: string[] | undefined) {
    if (values && values.length) {
      this.xaxis = { ...this.xaxis, categories: values };
    }
  }

  public chart: ApexChart = {
    fontFamily: 'DM Sans, sans-serif',
    height: 220,
    type: 'area',
    toolbar: { show: false },
    sparkline: { enabled: false },
  };

  public colors: string[] = ['#1a5dab', '#a9c6e8'];

  public stroke: ApexStroke = {
    curve: 'straight',
    width: [1.6, 1.2],
  };

  public fill: ApexFill = {
    type: ['solid', 'solid'],
    opacity: [0.08, 0],
  };

  public markers: ApexMarkers = {
    size: 0,
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 5 },
  };

  public grid: ApexGrid = {
    show: false,
    padding: { left: 4, right: 4 },
  };

  public dataLabels: ApexDataLabels = { enabled: false };

  public tooltip: ApexTooltip = {
    enabled: true,
    x: { format: 'dd MMM yyyy' },
  };

  public xaxis: ApexXAxis = {
    type: 'category',
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
    tooltip: { enabled: false },
    labels: {
      style: { fontSize: '11px', colors: '#8894a8' },
      rotate: 0,
      hideOverlappingLabels: true,
    },
    tickAmount: 5,
  };

  public yaxis: ApexYAxis = {
    show: false,
  };

  public legend: ApexLegend = {
    show: false,
  };
}
