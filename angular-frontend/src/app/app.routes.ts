import { Routes } from '@angular/router';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SuppsComponent } from './components/supps/supps.component';

export const routes: Routes = [
    { path: 'wishlist', component: WishlistComponent },
    { path: 'supps/:category/goals/:filterValue/:page', component: SuppsComponent },
    { path: 'supps/:category/brand/:filterValue/:page', component: SuppsComponent },
    { path: 'supps/:category/:page', component: SuppsComponent },
    { path: 'supps', redirectTo: 'supps/protein/1', pathMatch: 'full' }, // Default fallback
  ];