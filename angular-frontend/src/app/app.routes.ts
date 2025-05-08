import { Routes } from '@angular/router';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SupplementCardComponent } from './components/supplement-card/supplement-card.component';

export const routes: Routes = [
    { path: 'wishlist', component: WishlistComponent },
    { path: 'supps', component: SupplementCardComponent }



];
