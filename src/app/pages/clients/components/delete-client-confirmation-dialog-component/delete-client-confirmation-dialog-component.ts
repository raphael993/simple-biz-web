import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-client-confirmation-dialog-component',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-client-confirmation-dialog-component.html',
  styleUrl: './delete-client-confirmation-dialog-component.scss',
})
export class DeleteClientConfirmationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteClientConfirmationDialogComponent>);

  public close(comfirmation: boolean) {
    this.dialogRef.close(comfirmation);
  }
}
