import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgApexchartsModule,
    MatCardModule,
    MatButtonToggleModule,
    CurrencyPipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {

  analytics = inject(AnalyticsService);

  period = signal< 'month' | 'year'>('month');

  profitSeries = signal<ApexAxisChartSeries>([]);
  profitCategories = signal<string[]>([]);

  topProductsSeries = signal<number[]>([]);
  topProductsCategories = signal<string[]>([]);

  profitChart: ApexChart = {
    type: 'line',
    height: 320,
    toolbar: { show: false },
    animations: {
      enabled: true
    }
  };

  profitXAxis = signal<ApexXAxis>({
    categories: []
  });

  profitYAxis = {
    labels: {
      formatter: (value: number) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2
        }).format(value)
    }
  };

  profitTooltip = {
    y: {
      formatter: (value: number) =>
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2
        }).format(value)
    }
  };

  profitStroke: ApexStroke = {
    curve: 'smooth',
    width: 3
  };

  topProductsChart: ApexChart = {
    type: 'bar',
    height: 320,
    toolbar: { show: false }
  };

  topProductsPlot: ApexPlotOptions = {
    bar: {
      horizontal: true,
      borderRadius: 6
    }
  };

  topProductsDataLabels = {
    enabled: true
  };

  ngOnInit() {
    setTimeout(() => {
      this.loadProfit();
      this.loadTopProducts();
    }, 500)
  }

  loadProfit() {
    this.analytics.getProfit(this.period())
      .subscribe(data => {
        this.profitSeries.set([
          { name: 'Lucro', data: data.map(d => d.value) }
        ]);

        this.profitXAxis.set({
          categories: data.map(d => d.label)
        });
      });
  }

  loadTopProducts() {
    this.analytics.getTopProducts(this.period())
      .subscribe(data => {
        this.topProductsSeries.set(data.map(p => p.quantity));
        this.topProductsCategories.set(data.map(p => p.name));
      });
  }

  changePeriod(period: | 'month' | 'year') {
    this.period.set(period);
    this.loadProfit();
    this.loadTopProducts();
  }
}
