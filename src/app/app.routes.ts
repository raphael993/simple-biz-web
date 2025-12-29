import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ClientsComponent } from './pages/clients/clients';
import { SalesComponent } from './pages/sales/sales';
import { ProductsComponent } from './pages/products/products';
import { ClientDetailsComponent } from './pages/clients/components/client-details-component/client-details-component';
import { AdminComponent } from './pages/admin/admin';
import { ProductDetailsComponent } from './pages/products/components/product-details-component/product-details-component';
import { CheckoutComponent } from './pages/sales/components/checkout-component/checkout-component';
import { HistoryComponent } from './pages/history/history';
import { SaleDetailsComponent } from './pages/history/components/sale-details-component/sale-details-component';

export const routes: Routes = [
    { path: '', component: SalesComponent },
    { 
        path: 'clients',
        children: [
            { path: '', component: ClientsComponent },
            { 
                path: 'details',
                children: [
                    { path: '', component: ClientDetailsComponent },
                    { path: 'sale-details', component: SaleDetailsComponent }
                ]
            },
        ]
    },
    { 
        path: 'products',
        children: [
            { path: '', component: ProductsComponent },
            { path: 'details', component: ProductDetailsComponent }
        ]
    },
    { 
        path: 'sales',
        children: [
            { path: '', component: SalesComponent },
            { path: 'checkout', component: CheckoutComponent }
        ]
    },
    { 
        path: 'history',
        children: [
            { path: '', component: HistoryComponent },
            { path: 'details', component: SaleDetailsComponent }
        ]
    },
    { path: 'admin', component: AdminComponent },
];
