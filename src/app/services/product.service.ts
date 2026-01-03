import { inject, Injectable, signal } from "@angular/core";
import { FilterProduct, Product } from "../interfaces/product.interface";
import { from, Observable } from "rxjs";
import { ProductstorageService } from "../storage/product-storage.service";
import { APP_CONFIG } from "../config/app-config.token";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public selectedProduct = signal<Product | null>(null);
  public filterChange = signal<FilterProduct | null>(null);
  private readonly httpClient = inject(HttpClient);
  private config = inject(APP_CONFIG);
  
  private readonly productStorageService = inject(ProductstorageService);

  public getProductList(): Observable<Product[]> {
    if (this.config.offlineMode) {
      return from(this.productStorageService.getAll());
    }
    return this.httpClient.get<Product[]>(`${this.config.api}/products`);
  }

  public getProduct(id: string): Observable<Product | undefined> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.getById(id));
    }
    return this.httpClient.get<Product>(`${this.config.api}/products/${id}`);
  }

  public createProduct(product: Product): Observable<void> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.create(product));
    }
    return this.httpClient.post<void>(`${this.config.api}/products`, product);
  }

  public removeProduct(id: string): Observable<void> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.delete(id));
    }
    return this.httpClient.delete<void>(`${this.config.api}/products/${id}`);
  }

  public updateProduct(product: Product): Observable<void> {
    if (this.config.offlineMode) { 
      return from(this.productStorageService.update(product));
    }
    return this.httpClient.put<void>(`${this.config.api}/products/${product.id}`, product);
  }
}