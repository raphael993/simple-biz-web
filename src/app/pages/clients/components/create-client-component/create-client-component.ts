import { Component, inject, input, OnInit, output, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../../interfaces/client.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-client-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './create-client-component.html',
  styleUrl: './create-client-component.scss',
})
export class CreateClientComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public showClientForm = output<boolean>(); 
  public createClient = output<Client>();

  public clientForm!: FormGroup;

  public ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.clientForm = this.fb.group({
      id: [crypto.randomUUID()],
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.email]],
      phoneNumber: [null],
      document: [null],
      address: [null],
      bithDate: [null],
      notes: [null],
      createAt: [null]
    });
  }

  public createClientAction() {
    if (!this.clientForm.valid) {
      return;
    }
    const payload: Client = this.clientForm.getRawValue();
    this.createClient.emit(payload);
    this.showClientForm.emit(false);
  }

  public clearForm() {
    this.clientForm.reset();
  }
}
