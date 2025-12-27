import { Injectable } from '@angular/core';
import { openDB, DBSchema, StoreNames } from 'idb';

export interface AppDB extends DBSchema {
  clients: { key: string; value: any };
  products: { key: string; value: any };
  sale: { key: string; value: any };
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

  // backup

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

    db.clear('clients');
    db.clear('products');
    db.clear('sale');

    await tx.done;
  }
}
