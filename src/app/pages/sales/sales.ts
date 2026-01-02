import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { SelectClientComponent } from "./components/select-client-component/select-client-component";
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { Product } from '../../interfaces/product.interface';
import { ProductShowcaseComponent } from './components/product-showcase-component/product-showcase-component';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { ShoppingCartComponent } from "./components/shopping-cart-component/shopping-cart-component";
import { MatIconModule } from '@angular/material/icon';
import { UtilsService } from '../../services/utils.service';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../services/notification.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-sales',
  imports: [
    MatCardModule,
    MatButtonModule,
    SelectClientComponent,
    ProductShowcaseComponent,
    ShoppingCartComponent,
    MatIconModule,
    MatBadgeModule
],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class SalesComponent implements OnInit {

  clientService = inject(ClientService);
  productService = inject(ProductService);
  saleService = inject(SaleService);
  utils = inject(UtilsService);
  notificationService = inject(NotificationService);

  clients = signal<Array<Client>>([]);
  products = signal<Array<Product>>([]);
  originalProducts: Array<Product> = [];

  public showCart = signal<boolean>(false);

  ngOnInit(): void {
    this.getProducts();
    this.getClients();
    this.utils.mockLoaderPerSeconds(1);
  }

  getProducts() {
    this.productService.getProductList()
    .pipe(take(1))
    .subscribe(data => {
      if (data?.length) {
        this.products.set(data);
      }
    });
  }

  getClients() {
    this.clientService.getClientList()
    .pipe(take(1))
    .subscribe(data => {
      if (data?.length) {
        this.clients.set(data);
      }
    });
  }

  clearCart() {
    this.products.update(current => [...current])
  }

  toggleShowCart(state: boolean) {
    this.showCart.set(state);
  }
}
