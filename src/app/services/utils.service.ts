import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    public loaderState = signal<Boolean>(false);

    public setLoaderState(state = false) {
        this.loaderState.set(state);
    }

    public mockLoaderPerSeconds(seconds: number) {
        this.setLoaderState(true);
        setTimeout(() => {
            this.setLoaderState(false);
        }, seconds * 1000)
    }
    
    public isMobileScreen(): boolean {
        return window.innerWidth <= 768;
    }
}