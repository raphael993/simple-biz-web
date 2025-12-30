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
import { UtilsService } from '../../services/utils.service';

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
  private utils = inject(UtilsService);

  public showClientForm = signal<boolean>(false);
  public clientList: Array<Client> = [];

  public ngOnInit(): void {
    this.utils.mockLoaderPerSeconds(1);
    this.getClientList();
  }

  public createClient(payload: Client): void {
    this.clientService.createClient(payload).subscribe(() => {
      this.notificationService.openNotification('Cliente criado com sucesso!');
      this.getClientList();
    });
  }

  private getClientList(): void {
    this.clientService.getClientList().subscribe(data => {
      this.clientList = data;
    })
  }

  public deleteClient(payload: Client) {
    if (!payload.id) {
      return;
    }
    this.clientService.removeClient(payload.id).subscribe(() => {
      this.notificationService.openNotification('Cliente removido com sucesso!');
      this.getClientList();
    });
  }

  public toggleClientForm(state: boolean) {
    this.showClientForm.set(state);
  }
}
