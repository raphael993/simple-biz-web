import { AfterViewInit, Component, effect, inject, input, OnDestroy, output, ViewChild } from '@angular/core';
import { Client } from '../../../../interfaces/client.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ClientService } from '../../../../services/client.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UtilsService } from '../../../../services/utils.service';
import { MatMenuModule } from '@angular/material/menu';
import { DialogService } from '../../../../services/dialog.service';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-client-table-component',
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatMenuModule,
    NgxMaskPipe
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

  private readonly dialogService = inject(DialogService);
  private readonly utils = inject(UtilsService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['Nome', 'Telefone', 'E-mail', 'Ações'];

  constructor() {
    effect(() => {
      this.dataSource.data = this.clientList();
    });
  }

  public ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.checkScreen();
  }

  public checkScreen() {
    if (this.utils.isMobileScreen()) {
      this.displayedColumns = ['Nome', 'AçõesMobile'];
    }
  }

  public confirmDeletion(client: Client): void {
    this.dialogService
      .showConfirmationDialog({ title: 'Excluir cliente', message: `Tem certeza que deseja excluir o cliente ${client.name}?` })
      .subscribe(result => {
        if (!result) {
          return
        }
        this.deleteClient.emit(client);
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
