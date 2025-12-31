import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

interface FeatureItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-feature-panel-component',
  imports: [
    RouterModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './feature-panel-component.html',
  styleUrl: './feature-panel-component.scss',
})
export class FeaturePanelComponent {
  features: FeatureItem[] = [
    { label: 'Vender', icon: 'point_of_sale', route: '/sales' },
    { label: 'Clientes', icon: 'people', route: '/clients' },
    { label: 'Estoque', icon: 'inventory_2', route: '/products' },
    { label: 'Histórico', icon: 'history', route: '/history' },
    { label: 'Opções', icon: 'settings', route: '/admin' },
  ];
}
