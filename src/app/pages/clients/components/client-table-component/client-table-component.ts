import { AfterViewInit, Component, effect, inject, input, output, ViewChild } from '@angular/core';
import { Client } from '../../../../interfaces/client.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DeleteClientConfirmationDialogComponent } from '../delete-client-confirmation-dialog-component/delete-client-confirmation-dialog-component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-client-table-component',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './client-table-component.html',
  styleUrl: './client-table-component.scss',
})
export class ClientTableComponent implements AfterViewInit {
  public clientList = input<Array<Client>>([]);
  public dataSource = new MatTableDataSource<Client>();
  
  public deleteClient = output<Client>()
  private clientService = inject(ClientService);
  private router = inject(Router)

  private readonly dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'Nome', 'Telefone', 'E-mail', 'Ações'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.clientList();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  confirmDeletion(client: Client): void {
    this.dialog.open(DeleteClientConfirmationDialogComponent, {
      width: '250px'
    }).afterClosed().subscribe((data) => {
      if (!data) {
        return
      }
      this.deleteClient.emit(client)
    });
  }

  public search(event: Event) {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;
  }

  public showClientDetailsAction(client: Client) {
    this.clientService.selectedClient.set(client);
    this.router.navigate(['clients', 'details']);
  }
}
