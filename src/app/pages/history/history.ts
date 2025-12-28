import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SalesHistoryTableComponent } from './components/sales-history-table-component/sales-history-table-component';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../interfaces/sale.interface';

@Component({
  selector: 'app-history',
  imports: [
    MatCardModule,
    MatButtonModule,
    SalesHistoryTableComponent
  ],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent {
  private readonly saleService = inject(SaleService);

  public salesList: Array<Sale> = [];
  public filteredSalesList: Array<Sale> = [];

  public ngOnInit(): void {
    this.getSaleList();
  }

  private getSaleList(): void {
    this.saleService.getSalesList().subscribe(data => {
      this.salesList = data;
      this.filteredSalesList = data;
    })
  }
}
