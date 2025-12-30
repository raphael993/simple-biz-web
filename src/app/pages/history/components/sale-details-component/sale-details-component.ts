import { CommonModule, CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { SaleService } from '../../../../services/sale.service';
import { PaymentFormTypes } from '../../../../enums/payment-form-types';

@Component({
  selector: 'app-sale-details-component',
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
    CurrencyPipe,
    TitleCasePipe
  ],
  templateUrl: './sale-details-component.html',
  styleUrl: './sale-details-component.scss',
})
export class SaleDetailsComponent {
  private saleService = inject(SaleService);
  private router = inject(Router);
  public selectedSale = this.saleService.selectedSale;
  public paymentTypes = PaymentFormTypes;

  ngOnInit(): void {
    if (!this.selectedSale()) {
      this.router.navigate(['../']);
    }
  }

  public ngOnDestroy(): void {
    this.saleService.selectedSale.set(null);
  }
}
