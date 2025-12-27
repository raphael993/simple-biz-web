import { DatePipe } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { EditClientComponent } from '../edit-client-component/edit-client-component';
import { Client } from '../../../../interfaces/client.interface';
import { C } from '@angular/cdk/keycodes';
import { NotificationService } from '../../../../services/notification.service';
import { DialogService } from '../../../../services/dialog.service';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-client-details-component',
  imports: [
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    DatePipe,
    RouterLink,
    EditClientComponent,
    NgxMaskPipe
  ],
  templateUrl: './client-details-component.html',
  styleUrl: './client-details-component.scss',
})
export class ClientDetailsComponent implements OnInit, OnDestroy {
  private clientService = inject(ClientService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private dialogService = inject(DialogService);
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

  public saveClient(payload: Client): void {
    this.clientService.updateClient(payload).subscribe(() => {
      this.notificationService.openNotification('Cliente ataulizado com sucesso!');
      this.clientService.selectedClient.set(payload);
      this.toggleShowEditClient();
    });
  }
  public confirmDeletion(): void {
    this.dialogService
      .showConfirmationDialog({ title: 'Excluir cliente', message: `Tem certeza que deseja excluir o cliente ${this.selectedClient()?.name}?` })
      .subscribe(result => {
        if (!result) {
          return
        }
        this.deleteClient();
      });
  }

  private deleteClient() {
    const id = this.selectedClient()?.id;
    if (!id) {
      return
    }

    this.clientService.removeClient(id).subscribe(() => {
      this.notificationService.openNotification('Cliente removido com sucesso!');
      this.router.navigate(['clients']);
    });
  }

  public ngOnDestroy(): void {
    this.clientService.selectedClient.set(null);
  }
}
