import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header-component/header-component';
import { UtilsService } from './services/utils.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatProgressSpinnerModule,
    OverlayModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  utils = inject(UtilsService);
}
