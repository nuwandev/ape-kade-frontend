import { Routes } from '@angular/router';
import { Dashboard } from './page/dashboard/dashboard';
import { Login } from './page/login/login';
import { Register } from './page/register/register';
import { Customer } from './page/dashboard/customer/customer';
import { Item } from './page/dashboard/item/item';
import { Order } from './page/dashboard/order/order';
import { Overview } from './page/dashboard/overview/overview';
import { Category } from './page/dashboard/category/category';
import { PlaceOrder } from './page/dashboard/place-order/place-order';
import { OrderHistory } from './page/dashboard/order-history/order-history';
import { authGuard } from './auth-guard';
import { guestGuard } from './guest-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: Overview,
      },
      {
        path: 'customers',
        component: Customer,
      },
      {
        path: 'categories',
        component: Category,
      },
      {
        path: 'items',
        component: Item,
      },
      {
        path: 'orders',
        component: Order,
      },
      {
        path: 'place-order',
        component: PlaceOrder,
      },
      {
        path: 'order-history',
        component: OrderHistory,
      },
    ],
  },
];
