import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';

const ROUTES = {
    PRODUCTS: 'products'
}

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: ROUTES.PRODUCTS },
    { path: ROUTES.PRODUCTS, component: ProductsComponent }
];
