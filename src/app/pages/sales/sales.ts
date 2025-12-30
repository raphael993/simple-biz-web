import { Component, effect, inject, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-sales',
  imports: [
    MatCardModule,
    MatButtonModule,
    SelectClientComponent,
    ProductShowcaseComponent,
    ShoppingCartComponent,
    MatIconModule
],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class SalesComponent implements OnInit {

  clientService = inject(ClientService);
  productService = inject(ProductService);
  saleService = inject(SaleService);

  clients = signal<Array<Client>>([]);
  products = signal<Array<Product>>([]);
  originalProducts: Array<Product> = [];

  constructor() {
    effect(() => {
      const addToProductCart = this.saleService.addToProductCart()
      if (addToProductCart) {
        this.saleService.productCart.update(current => [...current, addToProductCart]);
      }
    })
  }

  ngOnInit(): void {
    this.getProducts();
    this.getClients();
  }

  getProducts() {
    this.productService.getProductList().subscribe(data => {
      this.products.set(data);
    });
  }

  getClients() {
    this.clientService.getClientList().subscribe(data => {
      this.clients.set(data);
    });
  }

  clearCart() {
    this.products.update(current => [...current])
  }
}
