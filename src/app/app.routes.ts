import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ClientsComponent } from './pages/clients/clients';
import { SalesComponent } from './pages/sales/sales';
import { ProductsComponent } from './pages/products/products';
import { ClientDetailsComponent } from './pages/clients/components/client-details-component/client-details-component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { 
        path: 'clients',
        children: [
            { path: '', component: ClientsComponent },
            { path: 'details', component: ClientDetailsComponent }
        ]
    },
    { path: 'products', component: ProductsComponent },
    { path: 'sales', component: SalesComponent },
    { path: 'clients/details', component: ClientDetailsComponent },
];
