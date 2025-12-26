import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogData } from '../../interfaces/confirmation-dialog-data.interface';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confimation-dialog-component',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './confimation-dialog-component.html',
  styleUrl: './confimation-dialog-component.scss',
})
export class ConfimationDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfimationDialogComponent>);
  readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  public close(response: boolean) {
    this.dialogRef.close(response);
  }
}
