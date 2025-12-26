import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase, StoreNames } from 'idb';
import { Client } from '../interfaces/client.interface';
import { Product } from '../interfaces/product.interface';
import { Sale } from '../interfaces/sale.interface';

interface AppDB extends DBSchema {
  clients: {
    key: string;
    value: Client;
  };
  products: {
    key: string;
    value: Product;
  };
  sale: {
    key: string;
    value: Sale;
  };
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService {

  private dbPromise = openDB<AppDB>('simple-biz', 1, {
    upgrade(db) {

      if (!db.objectStoreNames.contains('clients')) {
        db.createObjectStore('clients', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('sale')) {
        db.createObjectStore('sale', { keyPath: 'id' });
      }
    }
  });

  async getAll<S extends StoreNames<AppDB>>(
    storeName: S
  ): Promise<AppDB[S]['value'][]> {
    const db = await this.dbPromise;
    return db.getAll(storeName);
  }

  async getById<S extends StoreNames<AppDB>>(
    storeName: S,
    id: AppDB[S]['key']
  ): Promise<AppDB[S]['value'] | undefined> {
    const db = await this.dbPromise;
    return db.get(storeName, id);
  }

  async add<S extends StoreNames<AppDB>>(
    storeName: S,
    item: AppDB[S]['value']
  ): Promise<void> {
    const db = await this.dbPromise;
    await db.add(storeName, item);
  }

  async update<S extends StoreNames<AppDB>>(
    storeName: S,
    item: AppDB[S]['value']
  ): Promise<void> {
    const db = await this.dbPromise;
    await db.put(storeName, item);
  }

  async delete<S extends StoreNames<AppDB>>(
    storeName: S,
    id: AppDB[S]['key']
  ): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(storeName, id);
  }
}
