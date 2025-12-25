import { Injectable, signal } from "@angular/core";
import { Client } from "../interfaces/client.interface";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  public selectedClient = signal<Client | null>(null);

  private clientList: Array<Client> = [
    {
      id: '1',
      name: 'Hydrogen',
      phoneNumber: '(11) 9 7721 2313',
      email: 'teste@gmail.com',
      address: 'Rua mota milagres, 12',
      bithDate: new Date(),
      document: '123.123.123.22',
      notes: 'asdasdasdasdasdasd',
      createAt: new Date(),
    },
    {
      id: '2',
      name: 'AA DD',
      phoneNumber: '(11) 9 7721 2313',
      email: 'teste@gmail.com',
      address: '',
      bithDate: new Date(),
      document: '',
      notes: '',
      createAt: new Date(),
  }
  ];

  public getClientList(): Array<Client> {
    return this.clientList;
  }

  public getClient(id: string): Client | null {
    const source = this.clientList.find(client => client.id === id) ?? null;
    return source;
  }

  public createClient(client: Client) {
    this.clientList?.push(client);
  }

  public removeClient(id: string): Client | null {
    const source = this.clientList.find(client => client.id === id) ?? null;
    this.clientList = this.clientList.filter(client => client.id !== id);

    return source;
  }

  public updateClient(client: Client): Client {
    const id = client.id;
    const index = this.clientList.findIndex(client => client.id === id);
    
    this.clientList[index] = {
      ...this.clientList[index],
      ...client
    }

    return this.clientList[index];
  }
}