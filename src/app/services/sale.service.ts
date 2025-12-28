import { Injectable, signal } from "@angular/core";
import { Product } from "../interfaces/product.interface";

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  public addToProductCart = signal<Product | null>(null);
  public removeFromProductCart = signal<Product | null>(null);
  public productCart = signal<Array<Product>>([]);
}