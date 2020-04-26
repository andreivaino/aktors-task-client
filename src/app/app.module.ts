import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ClientManagementComponent } from './components/client-management/client-management.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { ProductsComponent } from './components/products/products.component';
import { NewClientComponent } from './components/new-client/new-client.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import {HttpClientModule} from '@angular/common/http';
import {OwnHttpClient} from './services/http-client/own-http-client.service';
import {SortingService} from './services/utils/sorting.service';
import {ReactiveFormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';

const appRoutes: Routes = [
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:order_number', component: OrderManagementComponent },
  { path: 'order/new', component: NewOrderComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'clients/:personal_id', component: ClientManagementComponent },
  { path: 'client/new', component: NewClientComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:barcode', component: ProductManagementComponent },
  { path: 'products/new', component: NewProductComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    OrderManagementComponent,
    OrdersComponent,
    ClientManagementComponent,
    ClientsComponent,
    ProductManagementComponent,
    ProductsComponent,
    NewClientComponent,
    NewProductComponent,
    NewOrderComponent,
    TopMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false}
    ),
    ReactiveFormsModule
  ],
  providers: [
    OwnHttpClient,
    SortingService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
