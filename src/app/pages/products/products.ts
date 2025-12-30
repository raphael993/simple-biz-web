import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductTableComponent } from './components/product-table-component/product-table-component';
import { CreateProductComponent } from './components/create-product-component/create-product-component';
import { NotificationService } from '../../services/notification.service';
import { FilterProduct, Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-products',
  imports: [
    MatCardModule,
    MatButtonModule,
    ProductTableComponent,
    CreateProductComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private utils = inject(UtilsService);

  public showProductForm = signal<boolean>(false);
  public productList: Array<Product> = [];
  public filteredProductList: Array<Product> = [];
  
  constructor() {
    effect(() => {
      const filters = this.productService.filterChange()
      if (filters) {
        this.applyFilter(this.productList, filters);
      }
    })
  }

  public ngOnInit(): void {
    this.utils.mockLoaderPerSeconds(1);
    this.getProductList();
  }

  public createProduct(payload: Product): void {
    this.productService.createProduct(payload).subscribe(() => {
      this.notificationService.openNotification('Produto criado com sucesso!');
      this.getProductList();
    });
  }

  private getProductList(): void {
    this.productService.getProductList().subscribe(data => {
      this.productList = data;
      this.filteredProductList = data;
    })
  }

  public deleteProduct(payload: Product) {
    if (!payload.id) {
      return;
    }
    this.productService.removeProduct(payload.id).subscribe(() => {
      this.notificationService.openNotification('Produto removido com sucesso!');
      this.getProductList();
    });
  }

  public toggleProductForm(state: boolean) {
    this.showProductForm.set(state);
  }

  private applyFilter(data: Array<Product>, filters: FilterProduct) {
    if (filters.clear) {
      this.getProductList();
      return;
    }

    let filtered: Array<Product> = data;
  
    if (filters.stockRange) {
      
      let fnStockRange = (product: Product) => false;

      switch (filters.stockRange) {
        case 'none': 
          fnStockRange = (product: Product) => product.quantity === 0;
          break;
        case '0-10': 
         fnStockRange = (product: Product) => product.quantity >= 0 && product.quantity <= 10;
         break;
        case '10-20': 
         fnStockRange = (product: Product) => product.quantity > 10 && product.quantity <= 20;
         break;
        case '20-30': 
         fnStockRange = (product: Product) => product.quantity > 20 && product.quantity <= 30;
         break;
        case '30+': 
         fnStockRange = (product: Product) => product.quantity > 30;
         break;
      }

      filtered = filtered.filter(fnStockRange);
    }
    if (filters.type) {
      filtered = filtered.filter((product) => product.type === filters.type);
    } 
    if (filters.isActive !== null) {
      filtered = filtered.filter((product) => product.isActive == filters.isActive);
    }

    this.filteredProductList = filtered;
  }
}
