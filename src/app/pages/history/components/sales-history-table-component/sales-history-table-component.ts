import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, effect, inject, input, ViewChild } from '@angular/core';
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
    // ProductFilterComponent,
  ],
  templateUrl: './sales-history-table-component.html',
  styleUrl: './sales-history-table-component.scss',
})
export class SalesHistoryTableComponent {
  public salesList = input<Array<Sale>>([]);
  public dataSource = new MatTableDataSource<Sale>();

  private saleService = inject(SaleService);
  private router = inject(Router)
  
  private readonly utils = inject(UtilsService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['Valor', 'Data', 'Cliente', 'Qt. Itens', 'Ações'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.salesList();
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

  public showProductDetailsAction(sale: Sale) {
    /* this.saleService.selectedProduct.set(product);
    this.router.navigate(['products', 'details']); */
  }
}
