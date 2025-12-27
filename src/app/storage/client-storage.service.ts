import { Injectable, inject } from '@angular/core';
import { Client } from '../interfaces/client.interface';
import { IndexedDbService } from './indexedDb.service';

@Injectable({ providedIn: 'root' })
export class ClientStorageService {

  private db = inject(IndexedDbService);

  getAll() {
    return this.db.getAll('clients');
    // Retorno inferido: Promise<Client[]>
  }

  getById(id: string) {
    return this.db.getById('clients', id);
    // Retorno inferido: Promise<Client | undefined>
  }

  async create(client: Client): Promise<void> {
    await this.db.add('clients', client);
  }

  async update(client: Client): Promise<void> {
    await this.db.update('clients', client);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete('clients', id);
  }
}
