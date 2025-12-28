import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SaleService } from '../../../../services/sale.service';
import { Product } from '../../../../interfaces/product.interface';
import { DialogService } from '../../../../services/dialog.service';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-shopping-cart-component',
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './shopping-cart-component.html',
  styleUrl: './shopping-cart-component.scss',
})
export class ShoppingCartComponent {
  private saleService = inject(SaleService);
  private dialogService = inject(DialogService);

  finishSale = output<void>();

  private rawCart = this.saleService.productCart;

  cartItems = signal<CartItem[]>([]);

  constructor() {
    this.groupCartItems();
  }

  private groupCartItems() {
    effect(() => {
      const items = this.rawCart();


      const grouped = items.reduce((acc, product) => {
        const existing = acc.find(i => i.product.id === product.id);

        if (existing) {
          existing.quantity++;
        } else {
          acc.push({ product, quantity: 1 });
        }

        return acc;
      }, [] as CartItem[]);

      this.cartItems.set(grouped);
    });
  }

  total = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  confirmDeletion(item: CartItem): void {
    this.dialogService
      .showConfirmationDialog({ title: 'Excluir', message: `Tem certeza que deseja excluir o item \"${item.product.name}\" do carrinho?` })
      .subscribe(result => {
        if (!result) {
          return
        }
        this.removeItem(item);
      });
  }

  private removeItem(item: CartItem) {
    this.saleService.removeFromProductCart.set({...item.product});
    if (item.quantity > 1) {
      const index = this.rawCart().findIndex(p => p.id === item.product.id);
      const tmp = this.rawCart();
      tmp.splice(index, 1);

      this.rawCart.set(tmp);

      this.saleService.productCart.update(current => [...current]);
      return;
    }
    this.saleService.productCart.update(current =>
      current.filter(p => p.id !== item.product.id)
    );
    
  }

  finalizePurchase() {
    this.finishSale.emit();
  }
}
