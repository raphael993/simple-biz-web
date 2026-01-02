import { Inject, inject, Injectable, signal } from "@angular/core";
import { Client } from "../interfaces/client.interface";
import { ClientStorageService } from "../storage/client-storage.service";
import { from, Observable, of } from "rxjs";
import { APP_CONFIG } from "../config/app-config.token";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(
    @Inject(APP_CONFIG) private config: { offlineMode: boolean }
  ) {}
  
  public selectedClient = signal<Client | null>(null);
  private readonly clientStorageService = inject(ClientStorageService);

  public getClientList(): Observable<Client[]> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.getAll());
    }
    return of();
  }

  public getClient(id: string): Observable<Client | undefined> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.getById(id));
    }
    return of();
  }

  public createClient(client: Client): Observable<void> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.create(client));
    }
    return of();
  }

  public removeClient(id: string): Observable<void> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.delete(id));
    }
    return of();
  }

  public updateClient(client: Client): Observable<void> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.update(client));
    }
    return of();
  }
}