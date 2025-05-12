import {Routes } from '@angular/router';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SuppsComponent } from './components/supps/supps.component';
import { SupplementDetailComponent } from './components/supplement-detail/supplement-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

export const routes: Routes = [
  { path: '', redirectTo: '/supps/sports%20nutrition/1', pathMatch: 'full' },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'supps/:filterType/:filterValue/:page', component: SuppsComponent },
  { path: 'supps/:category/:page', component: SuppsComponent },
  { path: 'supps', redirectTo: 'supps/sports%20nutrition/1', pathMatch: 'full' },
  {
    path: 'supplements/:id',
    component: SupplementDetailComponent
  },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'supps/search/:filterValue/:page', component: SuppsComponent },
  { path: 'login', component: LoginComponent },
  {path: 'user-orders',component: UserOrdersComponent}
];
