import { inject, Injectable, signal } from "@angular/core";
import { Client } from "../interfaces/client.interface";
import { ClientStorageService } from "../storage/client-storage.service";
import { from, Observable } from "rxjs";
import { APP_CONFIG } from "../config/app-config.token";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  public selectedClient = signal<Client | null>(null);
  private readonly clientStorageService = inject(ClientStorageService);
  private readonly httpClient = inject(HttpClient);
  private config = inject(APP_CONFIG);

  public getClientList(): Observable<Client[]> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.getAll());
    }
    return this.httpClient.get<Client[]>(`${this.config.api}/clients`);
  }

  public getClient(id: string): Observable<Client | undefined> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.getById(id));
    }
    return this.httpClient.get<Client>(`${this.config.api}/clients/${id}`);
  }

  public createClient(client: Client): Observable<void> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.create(client));
    }
    return this.httpClient.post<void>(`${this.config.api}/clients`, client);
  }

  public removeClient(id: string): Observable<void> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.delete(id));
    }
    return this.httpClient.delete<void>(`${this.config.api}/clients/${id}`);
  }

  public updateClient(client: Client): Observable<void> {
    if (this.config.offlineMode) {
      return from(this.clientStorageService.update(client));
    }
    return this.httpClient.put<void>(`${this.config.api}/clients/${client.id}`, client);
  }
}