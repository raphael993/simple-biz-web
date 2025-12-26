import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    public isMobileScreen(): boolean {
        return window.innerWidth <= 768;
    }
}