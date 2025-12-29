import { Injectable } from '@angular/core';
import { openDB, DBSchema, StoreNames } from 'idb';
import { Sale } from '../interfaces/sale.interface';

export interface AppDB extends DBSchema {
  clients: { key: string; value: any };
  products: { key: string; value: any };
  sale: {
    key: string;
    value: Sale;
    indexes: {
      'clientId_idx': string;
      'sellerId_idx': string;
    };
  };
}

@Injectable({ providedIn: 'root' })
export class IndexedDbService {

  private dbPromise = openDB<AppDB>('simple-biz', 2, {
    upgrade(db, oldVersion, newVersion, transaction) {

      if (!db.objectStoreNames.contains('clients')) {
        db.createObjectStore('clients', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: 'id' });
      }

      let saleStore;

      if (!db.objectStoreNames.contains('sale')) {
        saleStore = db.createObjectStore('sale', { keyPath: 'id' });
      } else {
        saleStore = transaction.objectStore('sale');
      }

      if (!saleStore.indexNames.contains('clientId_idx')) {
        saleStore.createIndex('clientId_idx', 'clientId', { unique: false });
      }

      if (!saleStore.indexNames.contains('sellerId_idx')) {
        saleStore.createIndex('sellerId_idx', 'sellerId', { unique: false });
      }
    }
  });

  /* ================= CRUD GENÉRICO ================= */

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

  /* ================= QUERIES COM INDEX ================= */

  async getSalesByClientId(clientId: string) {
    const db = await this.dbPromise;
    return db.getAllFromIndex('sale', 'clientId_idx', clientId);
  }

  async getSalesBySellerId(sellerId: string) {
    const db = await this.dbPromise;
    return db.getAllFromIndex('sale', 'sellerId_idx', sellerId);
  }

  /* ================= BACKUP ================= */

  async exportAll(): Promise<Record<string, unknown[]>> {
    const db = await this.dbPromise;

    const data: Record<string, unknown[]> = {};
    for (const store of db.objectStoreNames) {
      data[store] = await db.getAll(store);
    }

    return data;
  }

  async importAll(data: Record<string, unknown[]>): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction(db.objectStoreNames, 'readwrite');

    for (const store of db.objectStoreNames) {
      await tx.objectStore(store).clear();
      const items = data[store] ?? [];
      for (const item of items) {
        await tx.objectStore(store).put(item);
      }
    }

    await tx.done;
  }

  async resetDb() {
    const db = await this.dbPromise;
    const tx = db.transaction(db.objectStoreNames, 'readwrite');

    await tx.objectStore('clients').clear();
    await tx.objectStore('products').clear();
    await tx.objectStore('sale').clear();

    await tx.done;
  }
}
