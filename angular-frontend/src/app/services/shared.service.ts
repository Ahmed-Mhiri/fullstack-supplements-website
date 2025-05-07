import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Supplement } from '../models/supplement.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private cartItemsSubject = new BehaviorSubject<Supplement[]>([]); // Store cart items
  private favoriteItemsSubject = new BehaviorSubject<Supplement[]>([]); // Store favorite items

  cartItems$ = this.cartItemsSubject.asObservable();
  favoriteItems$ = this.favoriteItemsSubject.asObservable(); // Observable<Supplement[]>

  // Method to update the cart items
  updateCartItems(items: Supplement[]): void {
    this.cartItemsSubject.next(items);
  }

  // Method to update the favorite items
  updateFavoriteItems(items: Supplement[]): void {
    this.favoriteItemsSubject.next(items);
  }

  // Method to add a new item to the cart
  addToCart(item: Supplement): void {
    const currentCartItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next([...currentCartItems, item]);  // Add item to cart
  }

  // Method to add a new item to the favorite list
  addToFavorites(item: Supplement): void {
    const currentFavorites = this.favoriteItemsSubject.value;
    this.favoriteItemsSubject.next([...currentFavorites, item]);  // Add item to favorites
  }

  // Method to remove an item from the favorite list
  removeFromFavorites(item: Supplement): void {
    const updatedFavorites = this.favoriteItemsSubject.value.filter(fav => fav.id !== item.id);
    this.favoriteItemsSubject.next(updatedFavorites);  // Remove item from favorites
  }
  updateItemQuantity(item: Supplement, change: number): void {
    const currentCartItems = this.cartItemsSubject.value;
    const itemIndex = currentCartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (itemIndex !== -1) {
      currentCartItems[itemIndex].quantity += change;

      // If quantity becomes 0 or less, remove the item from the cart
      if (currentCartItems[itemIndex].quantity <= 0) {
        currentCartItems.splice(itemIndex, 1); // Remove the item
      }

      this.cartItemsSubject.next([...currentCartItems]);
    }
  }
}
