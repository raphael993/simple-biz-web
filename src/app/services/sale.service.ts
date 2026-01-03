import { inject, Injectable, signal } from "@angular/core";
import { CartItem, Product } from "../interfaces/product.interface";
import { from, Observable, of, Subject } from "rxjs";
import { FilterSale, Sale } from "../interfaces/sale.interface";
import { SaleStorageService } from "../storage/sale-storage.service";
import { APP_CONFIG } from "../config/app-config.token";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private _addToProductCart$ = new Subject<Product | null>();
  private _removeFromProductCart$ = new Subject<Product[]>();

  public productCart = signal<Product[]>([]);
  public checkoutData = signal<CartItem[]>([]);
  public selectedSale = signal<Sale | null>(null);
  public filterChange = signal<FilterSale | null>(null);

  private saleStorageService = inject(SaleStorageService);
  private config = inject(APP_CONFIG);
  private readonly httpClient = inject(HttpClient);

  public addToProductCartSubscriber() {
    return this._addToProductCart$.asObservable();
  }

  public removeFromProductCartSubscriber() {
    return this._removeFromProductCart$.asObservable();
  }

  public onAddToProductCart(product: Product | null) {
    return this._addToProductCart$.next(product);
  }

  public onRemoveFromProductCart(products: Product[]) {
    return this._removeFromProductCart$.next(products);
  }

  public getSalesList(): Observable<Sale[]> {
    if (this.config.offlineMode) {
      return from(this.saleStorageService.getAll());
    }
    return this.httpClient.get<Sale[]>(`${this.config.api}/sales`);
  }

  public createSale(payload: Sale): Observable<void> {
    if (this.config.offlineMode) { 
      return from(this.saleStorageService.create(payload));
    }
    return this.httpClient.post<void>(`${this.config.api}/sales`, payload);
  }

  public getSalesByClientId(clientId: string): Observable<Sale[]> {
    if (this.config.offlineMode) {
      return from(this.saleStorageService.getSalesByClientId(clientId));
    }
    return this.httpClient.get<Sale[]>(`${this.config.api}/sales/${clientId}`);
  }
}