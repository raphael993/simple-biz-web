import { inject, Injectable, signal } from "@angular/core";
import { Client } from "../interfaces/client.interface";
import { ClientStorageService } from "../storage/client-storage.service";
import { from, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  public selectedClient = signal<Client | null>(null);
  private readonly clientStorageService = inject(ClientStorageService);

  public getClientList(): Observable<Client[]> {
    return from(this.clientStorageService.getAll());
  }

  public getClient(id: string): Observable<Client | undefined> {
    return from(this.clientStorageService.getById(id));
  }

  public createClient(client: Client): Observable<void> {
    return from(this.clientStorageService.create(client));
  }

  public removeClient(id: string): Observable<void> {
    return from(this.clientStorageService.delete(id));
  }

  public updateClient(client: Client): Observable<void> {
    return from(this.clientStorageService.update(client));
  }
}