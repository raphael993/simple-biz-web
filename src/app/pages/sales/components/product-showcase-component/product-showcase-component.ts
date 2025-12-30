import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Product } from '../../../../interfaces/product.interface';
import { debounceTime, startWith } from 'rxjs';
import { NotificationService } from '../../../../services/notification.service';
import { SaleService } from '../../../../services/sale.service';
import { ProductType } from '../../../../enums/product-type.enum';

@Component({
  selector: 'app-product-showcase-component',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './product-showcase-component.html',
  styleUrl: './product-showcase-component.scss',
})
export class ProductShowcaseComponent {
  products = input<Product[]>([]);
  searchControl = new FormControl('');

  selectedProduct = signal<Product | null>(null);
  filteredProducts = signal<Product[]>([]);

  notificationService = inject(NotificationService);
  saleService = inject(SaleService);

  productType = ProductType;  

  constructor() {
    this.listenSearchChanges();

    effect(() => {
      const removedFromCart = this.saleService.removeFromProductCart();

      if (!removedFromCart.length || removedFromCart[0].type === ProductType.SERVICE) {
        return;
      }

      removedFromCart.forEach((toRemove) => {
        this.updateItemQuantity(toRemove, true);
      })
    })
  }

  private listenSearchChanges() {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300)
      )
      .subscribe(value => {
        const search = (value ?? '').toLowerCase();

        const filtered = this.products()
          .filter(p =>
            p.isActive &&
            p.name.toLowerCase().includes(search)
          );

        this.filteredProducts.set(this.removeNonListedItems(filtered));
      });
  }

  selectProduct(product: Product) {
    this.selectedProduct.set(product);
  }

  addToCart() {
    const product = this.selectedProduct();
    if (!product) return;
    
    if (product.type === ProductType.SERVICE) {
      this.saleService.addToProductCart.set({...product});
      return;
    }
    if (product.quantity == 0) {
      this.notificationService.openNotification('Sem estoque para adicionar o item ao carrinho.');
      return;
    }

    this.saleService.addToProductCart.set({...product});
    this.updateItemQuantity(product, false);
  }

  isSelected(product: Product): boolean {
    return this.selectedProduct()?.id === product.id;
  }

  removeNonListedItems(item: Product[]): Product[] {
    return item.filter((item: Product) => item.isActive && (item.quantity > 0 || item.type === this.productType.SERVICE));
  }

  updateItemQuantity(product: Product, increase: boolean = true) {
    this.filteredProducts.update(current => {
      const target = current.findIndex(item => item.id === product.id);
      
      if (increase) {
        current[target].quantity += 1;
      } else {
        if (current[target].quantity > 0) {
          current[target].quantity -= 1;
        }
      }

      return current
    });
  }
}
