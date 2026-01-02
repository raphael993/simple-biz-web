import { inject, Injectable, signal } from "@angular/core";
import { CartItem, Product } from "../interfaces/product.interface";
import { from, Observable, Subject } from "rxjs";
import { FilterSale, Sale } from "../interfaces/sale.interface";
import { SaleStorageService } from "../storage/sale-storage.service";

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
    return from(this.saleStorageService.getAll());
  }

  public createSale(payload: Sale): Observable<void> {
    return from(this.saleStorageService.create(payload));
  }

  public getSalesByClientId(clientId: string): Observable<Sale[]> {
    return from(this.saleStorageService.getSalesByClientId(clientId));
  }
}