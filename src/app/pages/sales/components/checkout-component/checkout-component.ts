import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SaleService } from '../../../../services/sale.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { PaymentMethodComponent } from '../payment-method-component/payment-method-component';
import { Payment } from '../../../../interfaces/payment.interface';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../../../services/client.service';
import { Sale } from '../../../../interfaces/sale.interface';
import { DialogService } from '../../../../services/dialog.service';
import { NotificationService } from '../../../../services/notification.service';
import { CartItem, Product } from '../../../../interfaces/product.interface';
import { ProductService } from '../../../../services/product.service';
import { ProductType } from '../../../../enums/product-type.enum';

@Component({
  selector: 'app-checkout-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatInputModule,
    PaymentMethodComponent,
    MatIconModule
  ],
  templateUrl: './checkout-component.html',
  styleUrl: './checkout-component.scss',
})
export class CheckoutComponent {
  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private dialogService = inject(DialogService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  cartItems = this.saleService.checkoutData;

  discountPercent = signal<number>(0);
  paymentStep = signal<boolean>(false);
  paymentsList = signal<Payment[]>([]);
  notes: string | null = null;

  subtotal = computed(() =>
    this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  );

  discountValue = computed(() =>
    this.subtotal() * (this.discountPercent() / 100)
  );

  total = computed(() =>
    this.subtotal() - this.discountValue()
  );

  goBack(): void {
    this.saleService.checkoutData.set([]);
    this.router.navigate(['../']);
  }

  onDiscountChange(value: string): void {
    const percent = Number(value);
    this.discountPercent.set(
      percent >= 0 && percent <= 100 ? percent : 0
    );
  }

  generatePdf(): void {
    window.print()
  }

  togglePaymentStep(isPaymentStep: boolean) {
    this.paymentStep.set(isPaymentStep);
  }

  onPayments(paymentsList: Payment[]) {
    this.paymentsList.set(paymentsList);
    this.createSale();
  }

  public confirmSale(): void {
    this.dialogService
      .showConfirmationDialog({ title: 'Confirmar venda', message: `Tem certeza que deseja confirmar esta venda?` })
      .subscribe((result) => {
        if (!result) {
          return
        }
        this.createSale();
      });
  }

  createSale() {
    const sale: Sale = {
      id: crypto.randomUUID(),
      sellerId: null,
      clientId: this.clientService.selectedClient()?.id ?? null,
      clientName: this.clientService.selectedClient()?.name ?? null,
      cartItems: this.cartItems(),
      discountPercent: this.discountPercent(),
      discountValue: this.discountValue(),
      subtotal: this.subtotal(),
      total: this.total(),
      profit: this.profitCalc(this.cartItems(), this.total()) - (this.discountValue()),
      paymentsList: this.paymentsList(),
      createAt: new Date(),
      notes: this.notes
    }

    this.saleService.createSale(sale).subscribe(() => {
      this.removeSoldProductsFromStock(sale.cartItems);
    });
  }

  removeSoldProductsFromStock(soldItems: CartItem[]) {
    soldItems.forEach(sold => {
      if (sold.product.type === ProductType.SERVICE) {
        return;
      }
      this.productService.updateProduct({ 
        ...sold.product,
        quantity: (sold.product.quantity - sold.quantity)
      })
    });

    this.notificationService.openNotification('Venda realizada com sucesso!');
    this.clearState();
    this.router.navigate(['/sales']);
  }

  clearState() {
    this.clientService.selectedClient.set(null);
    this.saleService.addToProductCart.set(null);
    this.saleService.removeFromProductCart.set([]);
    this.saleService.productCart.set([]);
    this.saleService.checkoutData.set([]);
  }

  profitCalc(cartItems: CartItem[], total: number) {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price - (item.product.costPrice ?? 0) ,
      0
    )
  }

}
