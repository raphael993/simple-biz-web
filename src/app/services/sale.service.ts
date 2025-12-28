import { inject, Injectable, signal } from "@angular/core";
import { CartItem, Product } from "../interfaces/product.interface";
import { from, Observable } from "rxjs";
import { Sale } from "../interfaces/sale.interface";
import { SaleStorageService } from "../storage/sale-storage.service";

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  public addToProductCart = signal<Product | null>(null);
  public removeFromProductCart = signal<Product | null>(null);
  public productCart = signal<Product[]>([]);
  public checkoutData = signal<CartItem[]>([]);

  private saleStorageService = inject(SaleStorageService);

  public getSalesList(): Observable<Sale[]> {
    return from(this.saleStorageService.getAll());
  }

  public createSale(payload: Sale): Observable<void> {
    return from(this.saleStorageService.create(payload));
  }
}