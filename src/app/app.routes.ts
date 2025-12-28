import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ClientsComponent } from './pages/clients/clients';
import { SalesComponent } from './pages/sales/sales';
import { ProductsComponent } from './pages/products/products';
import { ClientDetailsComponent } from './pages/clients/components/client-details-component/client-details-component';
import { AdminComponent } from './pages/admin/admin';
import { ProductDetailsComponent } from './pages/products/components/product-details-component/product-details-component';

export const routes: Routes = [
    { path: '', component: SalesComponent },
    { 
        path: 'clients',
        children: [
            { path: '', component: ClientsComponent },
            { path: 'details', component: ClientDetailsComponent }
        ]
    },
    { 
        path: 'products',
        children: [
            { path: '', component: ProductsComponent },
            { path: 'details', component: ProductDetailsComponent }
        ]
    },
    { path: 'sales', component: SalesComponent },
    { path: 'admin', component: AdminComponent },
];
