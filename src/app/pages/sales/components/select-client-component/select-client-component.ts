import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Client } from '../../../../interfaces/client.interface';
import { toSignal } from '@angular/core/rxjs-interop';
import { ClientService } from '../../../../services/client.service';

@Component({
  selector: 'app-select-client-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
  ],
  templateUrl: './select-client-component.html',
  styleUrl: './select-client-component.scss',
})
export class SelectClientComponent {
  clients = input<Client[]>([]);
  clientSelected = output<Client | null>();
  clientService = inject(ClientService);

  clientControl = new FormControl<string | Client>('');

  private filterValue = toSignal(
    this.clientControl.valueChanges,
    { initialValue: '' }
  );

  filteredClients = computed(() => {
    const value = this.filterValue();
    const filter =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.name.toLowerCase();

    return this.clients().filter(client =>
      client.name.toLowerCase().includes(filter ?? '')
    );
  });

  displayFn(client: Client): string {
    return client?.name ?? '';
  }

  onClientSelected(client: Client): void {
    this.clientService.selectedClient.set(client);
    this.clientSelected.emit(client);
  }

  changeClient(): void {
    this.clientService.selectedClient.set(null);
    this.clientControl.reset('');
    this.clientSelected.emit(null);
  }
}
