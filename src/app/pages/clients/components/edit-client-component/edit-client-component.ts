import { Component, inject, input, OnInit, output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../../interfaces/client.interface';
import { ClientService } from '../../../../services/client.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective } from 'ngx-mask';
import moment from 'moment';

@Component({
  selector: 'app-edit-client-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  templateUrl: './edit-client-component.html',
  styleUrl: './edit-client-component.scss',
})
export class EditClientComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly clientService = inject(ClientService)
  public clientForm!: FormGroup;
  public selectedClient = this.clientService.selectedClient;
  public cancel = output();
  public save = output<Client>();

  public ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.clientForm = this.fb.group({
      id: [this.selectedClient()?.id],
      name: [this.selectedClient()?.name, [Validators.required, Validators.minLength(3)]],
      email: [this.selectedClient()?.email, [Validators.email]],
      phoneNumber: [this.selectedClient()?.phoneNumber],
      document: [this.selectedClient()?.document],
      address: [this.selectedClient()?.address],
      bithDate: [this.selectedClient()?.bithDate],
      notes: [this.selectedClient()?.notes],
      createAt: [this.selectedClient()?.createAt]
    });
  }

  public editClientAction() {
    if (!this.clientForm.valid) {
      return;
    }
    const payload: Client = { ...this.clientForm.getRawValue(), bithDate: moment(this.clientForm.getRawValue().bithDate).toDate() };
    this.save.emit(payload);
  }

  public cancelAction() {
    this.cancel.emit();
  }
}
