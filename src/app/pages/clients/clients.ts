import { Component, inject, OnInit, signal } from '@angular/core';
import { Client } from '../../interfaces/client.interface';
import { ClientService } from '../../services/client.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ClientTableComponent } from './components/client-table-component/client-table-component';
import { CreateClientComponent } from './components/create-client-component/create-client-component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-clients',
  imports: [
    MatCardModule,
    MatButtonModule,
    ClientTableComponent,
    CreateClientComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class ClientsComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private notificationService = inject(NotificationService);

  public showClientForm = signal<boolean>(false);
  public clientList: Array<Client> = [];

  public ngOnInit(): void {
    this.getClientList();
  }

  public createClient(payload: Client): void {
    this.clientService.createClient(payload);
    this.getClientList();
  }

  private updateClient(client: Client): void {
    this.clientService.updateClient(client);
    this.getClientList();
  }

  private getClientList(): void {
    this.clientList = this.clientService.getClientList();
  }

  public deleteClient(client: Client) {
    if (!client.id) {
      return;
    }
    this.clientService.removeClient(client.id);
    this.notificationService.openNotification('Cliente removido com sucesso!');
    this.getClientList();
  }

  public toggleClientForm(state: boolean) {
    this.showClientForm.set(state);
  }
}
