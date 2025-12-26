import { inject, Injectable } from "@angular/core";
import { ConfirmationDialogData } from "../interfaces/confirmation-dialog-data.interface";
import { MatDialog } from "@angular/material/dialog";
import { ConfimationDialogComponent } from "../components/confimation-dialog-component/confimation-dialog-component";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private readonly dialog = inject(MatDialog);
    
    public showConfirmationDialog(data: ConfirmationDialogData): Observable<any> {
        return this.dialog.open(ConfimationDialogComponent, { width: '300px', data }).afterClosed();
    }
}