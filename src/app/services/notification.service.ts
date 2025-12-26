import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private _snackBar = inject(MatSnackBar);
    
    public openNotification(text: string): void {
        this._snackBar.open(text, undefined, {
            duration: 3000
        });
    }
}