import { Injectable, inject } from '@angular/core';
import { IndexedDbService } from './indexedDb.service';
import { Sale } from '../interfaces/sale.interface';

@Injectable({ providedIn: 'root' })
export class SaleStorageService {

  private db = inject(IndexedDbService);

  getAll(): Promise<Sale[]> {
    return this.db.getAll('sale');
  }

  async create(payload: Sale): Promise<void> {
    await this.db.add('sale', payload);
  }
}
