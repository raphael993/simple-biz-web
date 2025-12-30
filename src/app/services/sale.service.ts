import { inject, Injectable, signal } from "@angular/core";
import { CartItem, Product } from "../interfaces/product.interface";
import { from, Observable } from "rxjs";
import { FilterSale, Sale } from "../interfaces/sale.interface";
import { SaleStorageService } from "../storage/sale-storage.service";

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  public addToProductCart = signal<Product | null>(null);
  public removeFromProductCart = signal<Product[]>([]);
  public productCart = signal<Product[]>([]);
  public checkoutData = signal<CartItem[]>([]);
  public selectedSale = signal<Sale | null>(null);
  public filterChange = signal<FilterSale | null>(null);

  private saleStorageService = inject(SaleStorageService);

  public getSalesList(): Observable<Sale[]> {
    return from(this.saleStorageService.getAll());
  }

  public createSale(payload: Sale): Observable<void> {
    return from(this.saleStorageService.create(payload));
  }

  public getSalesByClientId(clientId: string): Observable<Sale[]> {
    return from(this.saleStorageService.getSalesByClientId(clientId));
  }
}