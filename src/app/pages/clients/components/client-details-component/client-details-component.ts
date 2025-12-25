import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { EditClientComponent } from '../edit-client-component/edit-client-component';
import { Client } from '../../../../interfaces/client.interface';
import { C } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-client-details-component',
  imports: [
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
    EditClientComponent
  ],
  templateUrl: './client-details-component.html',
  styleUrl: './client-details-component.scss',
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  private clientService = inject(ClientService);
  private router = inject(Router);
  public selectedClient = this.clientService.selectedClient;
  public showEditClient = signal<boolean>(false);

  ngOnInit(): void {
    if (!this.selectedClient()) {
      this.router.navigate(['../']);
    }
  }

  public toggleShowEditClient() {
    this.showEditClient.update(current => !current);
  }

  public saveClient(client: Client) {
    this.clientService.updateClient(client);
    this.clientService.selectedClient.set(client);
    this.toggleShowEditClient();
  }

  public ngOnDestroy(): void {
    this.clientService.selectedClient.set(null);
  }
}
