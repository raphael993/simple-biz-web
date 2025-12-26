import { Injectable, inject } from '@angular/core';
import { IndexedDbService } from './indexedDb.service';
import { Product } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ProductstorageService {

  private db = inject(IndexedDbService);

  getAll() {
    return this.db.getAll('products');
  }

  getById(id: string) {
    return this.db.getById('products', id);
  }

  async create(product: Product): Promise<void> {
    await this.db.add('products', product);
  }

  async update(product: Product): Promise<void> {
    await this.db.update('products', product);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete('products', id);
  }
}
