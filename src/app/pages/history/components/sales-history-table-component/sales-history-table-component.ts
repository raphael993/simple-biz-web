import { CurrencyPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, effect, inject, input, OnDestroy, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Sale } from '../../../../interfaces/sale.interface';
import { SaleService } from '../../../../services/sale.service';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { HistoryFilterComponent } from "../history-filter-component/history-filter-component";
import { CdkVirtualScrollableElement } from "@angular/cdk/scrolling";

@Component({
  selector: 'app-sales-history-table-component',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatMenuModule,
    CurrencyPipe,
    DatePipe,
    HistoryFilterComponent,
    CdkVirtualScrollableElement
],
  templateUrl: './sales-history-table-component.html',
  styleUrl: './sales-history-table-component.scss',
})
export class SalesHistoryTableComponent implements AfterViewInit {
  public salesList = input<Array<Sale>>([]);
  public dataSource = new MatTableDataSource<Sale>();

  private saleService = inject(SaleService);
  private router = inject(Router)

  private readonly utils = inject(UtilsService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['Valor', 'Data', 'Cliente', 'Qt. Itens', 'Ações'];

  generalBalance: {
    isHide: boolean,
    salesNumber: number,
    itensNumber: number,
    totalValue: number,
    profit: number
  } = { isHide: false, salesNumber: 0, itensNumber: 0, totalValue: 0, profit: 0 };

  constructor() {
    effect(() => {
      this.dataSource.data = this.salesList();
      this.calculateBalance();
    });
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.checkScreen();
  }

  public checkScreen() {
    if (this.utils.isMobileScreen()) {
      this.displayedColumns = ['Valor', 'Data', 'Cliente', 'AçõesMobile'];
    }
  }

  public search(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
  }

  public showSaleDetailsAction(sale: Sale) {
    this.saleService.selectedSale.set(sale);
    this.router.navigate(['history', 'details']);
  }

  calculateBalance() {
    const sales = this.salesList();

    let salesNumber = sales.length;
    let itensNumber = 0;
    let totalValue = 0;
    let profit = 0;

    sales.forEach(sale => {
      itensNumber += sale.cartItems.length;
      totalValue += sale.total ?? 0;
      profit += sale.profit ?? 0;
    });

    this.generalBalance = { 
      ...this.generalBalance,
      salesNumber,
      itensNumber,
      totalValue,
      profit 
    }
  }

  toggleVisibilityBalance() {
    this.generalBalance.isHide = !this.generalBalance.isHide;
  }
}
