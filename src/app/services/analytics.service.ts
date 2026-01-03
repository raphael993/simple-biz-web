import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartPoint, TopProduct } from '../interfaces/analytics.interface';
import { APP_CONFIG } from '../config/app-config.token';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  getProfit(period: 'day' | 'month' | 'year'): Observable<ChartPoint[]> {
    return this.http.get<ChartPoint[]>(`${this.config.api}/analytics/profit`, {
      params: { period }
    });
  }

  getTopProducts(period: 'day' | 'month' | 'year'): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.config.api}/analytics/top-products`, {
      params: { period }
    });
  }
}
