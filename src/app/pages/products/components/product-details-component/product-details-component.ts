import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { EditProductComponent } from '../edit-product-component/edit-product-component';
import { ProductService } from '../../../../services/product.service';
import { NotificationService } from '../../../../services/notification.service';
import { DialogService } from '../../../../services/dialog.service';
import { Product } from '../../../../interfaces/product.interface';

@Component({
  selector: 'app-product-details-component',
  imports: [
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
    EditProductComponent
  ],
  templateUrl: './product-details-component.html',
  styleUrl: './product-details-component.scss',
})
export class ProductDetailsComponent {
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
  public selectedProduct = this.productService.selectedProduct;
  public showEditProduct = signal<boolean>(false);

  ngOnInit(): void {
    if (!this.selectedProduct()) {
      this.router.navigate(['../']);
    }
  }

  public toggleShowEditProduct() {
    this.showEditProduct.update(current => !current);
  }

  public saveProduct(payload: Product): void {
    this.productService.updateProduct(payload).subscribe(() => {
      this.notificationService.openNotification('Produto ataulizado com sucesso!');
      this.productService.selectedProduct.set(payload);
      this.toggleShowEditProduct();
    });
  }
  public confirmDeletion(): void {
    this.dialogService
      .showConfirmationDialog({ title: 'Excluir produto', message: `Tem certeza que deseja excluir o produto ${this.selectedProduct()?.name}?` })
      .subscribe(result => {
        if (!result) {
          return
        }
        this.deleteProduct();
      });
  }

  private deleteProduct() {
    const id = this.selectedProduct()?.id;
    if (!id) {
      return
    }

    this.productService.removeProduct(id).subscribe(() => {
      this.notificationService.openNotification('Produto removido com sucesso!');
      this.router.navigate(['products']);
    });
  }

  public ngOnDestroy(): void {
    this.productService.selectedProduct.set(null);
  }
}
