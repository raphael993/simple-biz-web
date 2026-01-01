import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SalesHistoryTableComponent } from './components/sales-history-table-component/sales-history-table-component';
import { SaleService } from '../../services/sale.service';
import { FilterSale, Sale } from '../../interfaces/sale.interface';
import { UtilsService } from '../../services/utils.service';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-history',
  imports: [
    MatCardModule,
    MatButtonModule,
    SalesHistoryTableComponent,
    MatIconModule,
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent {
  private readonly saleService = inject(SaleService);
  private utils = inject(UtilsService);
  private notificationService = inject(NotificationService);

  public showBalance = signal<boolean>(true);
  public salesList: Array<Sale> = [];
  public filteredSalesList: Array<Sale> = [];

  constructor() {
    effect(() => {
      const filters = this.saleService.filterChange()
      if (filters) {
        this.applyFilter(this.salesList, filters);
      }
    })
  }

  public ngOnInit(): void {
    this.utils.mockLoaderPerSeconds(1);
    this.getSaleList();
  }

  private getSaleList(): void {
    this.saleService.getSalesList().subscribe(data => {
      this.salesList = data;
      this.filteredSalesList = data;
    })
  }

  private applyFilter(data: Array<Sale>, filters: FilterSale) {
    if (filters.clear) {
      this.getSaleList();
      return;
    }

    const start = filters.startDate
      ? new Date(filters.startDate).getTime()
      : null;

    const end = filters.endDate
      ? new Date(filters.endDate).setHours(23, 59, 59, 999)
      : null;

    this.filteredSalesList = data.filter(sale => {
      const saleDate = new Date(sale.createAt as any).getTime();

      if (start && saleDate < start) return false;
      if (end && saleDate > end) return false;

      return true;
    });
  }

  public advancedView() {
    this.notificationService.openNotification('Esta funcionalidade não está disponível no momento.');
  }
}
