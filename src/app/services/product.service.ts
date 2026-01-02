import { Inject, inject, Injectable, signal } from "@angular/core";
import { FilterProduct, Product } from "../interfaces/product.interface";
import { from, Observable, of } from "rxjs";
import { ProductstorageService } from "../storage/product-storage.service";
import { APP_CONFIG } from "../config/app-config.token";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    @Inject(APP_CONFIG) private config: { offlineMode: boolean }
  ) {}
  
  public selectedProduct = signal<Product | null>(null);
  public filterChange = signal<FilterProduct | null>(null);
  
  private readonly productStorageService = inject(ProductstorageService);

  public getProductList(): Observable<Product[]> {
    if (this.config.offlineMode) {
      return from(this.productStorageService.getAll());
    }
    return of();
  }

  public getProduct(id: string): Observable<Product | undefined> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.getById(id));
    }
    return of();
  }

  public createProduct(product: Product): Observable<void> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.create(product));
    }
    return of();
  }

  public removeProduct(id: string): Observable<void> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.delete(id));
    }
    return of();
  }

  public updateProduct(product: Product): Observable<void> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.update(product));
    }
    return of();
  }
}