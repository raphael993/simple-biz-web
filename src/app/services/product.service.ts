import { inject, Injectable, signal } from "@angular/core";
import { FilterProduct, Product } from "../interfaces/product.interface";
import { from, Observable } from "rxjs";
import { ProductstorageService } from "../storage/product-storage.service";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public selectedProduct = signal<Product | null>(null);
  public filterChange = signal<FilterProduct | null>(null);
  
  private readonly productStorageService = inject(ProductstorageService);

  public getProductList(): Observable<Product[]> {
    return from(this.productStorageService.getAll());
  }

  public getProduct(id: string): Observable<Product | undefined> {
    return from(this.productStorageService.getById(id));
  }

  public createProduct(product: Product): Observable<void> {
    return from(this.productStorageService.create(product));
  }

  public removeProduct(id: string): Observable<void> {
    return from(this.productStorageService.delete(id));
  }

  public updateProduct(product: Product): Observable<void> {
    return from(this.productStorageService.update(product));
  }
}