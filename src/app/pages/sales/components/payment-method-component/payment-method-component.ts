import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Payment, PaymentType } from '../../../../interfaces/payment.interface';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PaymentFormTypes } from '../../../../enums/payment-form-types';
import { DialogService } from '../../../../services/dialog.service';


@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    NgxCurrencyDirective,
    ReactiveFormsModule,
    MatIconModule
  ],
  templateUrl: './payment-method-component.html',
  styleUrl: './payment-method-component.scss'
})
export class PaymentMethodComponent {

  /** valor total recebido do componente pai */
  total = input.required<number>();
  pay = output<Payment[]>();
  backToCheckout = output();

  dialogService = inject(DialogService);

  paymentFormTypes = PaymentFormTypes;

  /** pagamentos adicionados */
  payments = signal<Payment[]>([]);

  /** tipo selecionado */
  selectedType = signal<PaymentType>('PIX');

  /** FormControl usado pelo ngx-currency */
  valueControl = new FormControl<number>(0, { nonNullable: true });

  /** total já pago */
  paid = computed(() =>
    this.payments().reduce((sum, p) => sum + p.value, 0)
  );

  /** valor restante */
  remaining = computed(() =>
    Math.max(this.total() - this.paid(), 0)
  );

  constructor() {
    /** sempre que o restante mudar, preencher o input automaticamente */
    effect(() => {
      this.valueControl.setValue(this.remaining(), { emitEvent: false });
    });
  }

  addPayment(): void {
    const value = this.valueControl.value;

    if (!value || value <= 0) return;
    if (value > this.remaining()) return;

    this.payments.update(list => [
      ...list,
      { type: this.selectedType(), value }
    ]);
  }

  removePayment(index: number): void {
    this.payments.update(list =>
      list.filter((_, i) => i !== index)
    );
  }

  isComplete(): boolean {
    return this.remaining() === 0;
  }

  getResult(): Payment[] {
    return this.payments();
  }

  onPayment() {
    this.dialogService
      .showConfirmationDialog({ title: 'Confirmar venda', message: `Tem certeza que deseja confirmar esta venda?` })
      .subscribe((result) => {
        if (!result) {
          return
        }
        this.pay.emit(this.payments());
      });
  }

  goBack() {
    this.backToCheckout.emit();
  }
}
