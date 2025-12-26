import { Component, effect, inject, input, output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Product } from '../../../../interfaces/product.interface';
import { ProductService } from '../../../../services/product.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../../services/dialog.service';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-product-table-component',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatMenuModule,
],
  templateUrl: './product-table-component.html',
  styleUrl: './product-table-component.scss',
})
export class ProductTableComponent {
  public productList = input<Array<Product>>([]);
  public dataSource = new MatTableDataSource<Product>();
  
  public deleteProduct = output<Product>()
  private productService = inject(ProductService);
  private router = inject(Router)

  private readonly dialogService = inject(DialogService);
  private readonly utils = inject(UtilsService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['Nome', 'Preço', 'Estoque', 'Tipo', 'Ativo', 'Ações' ];

  constructor() {
    effect(() => {
      this.dataSource.data = this.productList();
    });
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.checkScreen();
  }

  public checkScreen() {
    if (this.utils.isMobileScreen()) {
      this.displayedColumns = ['Nome', 'Preço', 'Estoque', 'AçõesMobile'];
    }
  }

  public confirmDeletion(product: Product): void {
    this.dialogService
      .showConfirmationDialog({ title: 'Excluir producto', message: `Tem certeza que deseja excluir o producto ${product.name}?` })
      .subscribe(result => {
        if (!result) {
          return
        }
        this.deleteProduct.emit(product);
      });
  }

  public search(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
  }

  public showProductDetailsAction(product: Product) {
    this.productService.selectedProduct.set(product);
    this.router.navigate(['products', 'details']);
  }
}
