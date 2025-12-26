import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductTableComponent } from './components/product-table-component/product-table-component';
import { CreateProductComponent } from './components/create-product-component/create-product-component';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

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

  public showProductForm = signal<boolean>(false);
  public productList: Array<Product> = [];

  public ngOnInit(): void {
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
}
