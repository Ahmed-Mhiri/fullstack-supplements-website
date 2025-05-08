import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Supplement } from '../models/supplement.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private readonly CART_KEY = 'cart_items';
  private readonly FAVORITES_KEY = 'favorite_items';

  private cartItemsSubject = new BehaviorSubject<Supplement[]>(this.loadFromStorage(this.CART_KEY));
  private favoriteItemsSubject = new BehaviorSubject<Supplement[]>(this.loadFromStorage(this.FAVORITES_KEY));

  cartItems$ = this.cartItemsSubject.asObservable();
  favoriteItems$ = this.favoriteItemsSubject.asObservable();

  // ------------------ Cart Methods ------------------

  updateCartItems(items: Supplement[]): void {
    const roundedItems = items.map(item => ({
      ...item,
      priceEuro: this.roundToTwoDecimalPlaces(item.priceEuro)
    }));

    this.cartItemsSubject.next(roundedItems);
    this.saveToStorage(this.CART_KEY, roundedItems);
  }

  addToCart(item: Supplement): void {
    const currentCartItems = this.cartItemsSubject.value;
    const itemIndex = currentCartItems.findIndex((i) => i.id === item.id);

    const roundedItem = { ...item, priceEuro: this.roundToTwoDecimalPlaces(item.priceEuro) };

    if (itemIndex !== -1) {
      const updatedItem = {
        ...currentCartItems[itemIndex],
        quantity: currentCartItems[itemIndex].quantity + 1,
        priceEuro: this.roundToTwoDecimalPlaces(currentCartItems[itemIndex].priceEuro)
      };
      const updatedCart = [...currentCartItems];
      updatedCart[itemIndex] = updatedItem;
      this.cartItemsSubject.next(updatedCart);
      this.saveToStorage(this.CART_KEY, updatedCart);
    } else {
      const newCart = [
        ...currentCartItems,
        { ...roundedItem, quantity: 1 }
      ];
      this.cartItemsSubject.next(newCart);
      this.saveToStorage(this.CART_KEY, newCart);
    }
  }

  updateItemQuantity(item: Supplement, change: number): void {
    const currentCartItems = [...this.cartItemsSubject.value];
    const itemIndex = currentCartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (itemIndex !== -1) {
      currentCartItems[itemIndex].quantity += change;
      currentCartItems[itemIndex].priceEuro = this.roundToTwoDecimalPlaces(currentCartItems[itemIndex].priceEuro);

      if (currentCartItems[itemIndex].quantity <= 0) {
        currentCartItems.splice(itemIndex, 1);
      }

      this.cartItemsSubject.next(currentCartItems);
      this.saveToStorage(this.CART_KEY, currentCartItems);
    }
  }

  // ------------------ Favorites Methods ------------------

  updateFavoriteItems(items: Supplement[]): void {
    this.favoriteItemsSubject.next(items);
    this.saveToStorage(this.FAVORITES_KEY, items);
  }

  addToFavorites(item: Supplement): void {
    const currentFavorites = this.favoriteItemsSubject.value;
    const updatedFavorites = [...currentFavorites, item];
    this.favoriteItemsSubject.next(updatedFavorites);
    this.saveToStorage(this.FAVORITES_KEY, updatedFavorites);
  }

  removeFromFavorites(item: Supplement): void {
    const updatedFavorites = this.favoriteItemsSubject.value.filter(fav => fav.id !== item.id);
    this.favoriteItemsSubject.next(updatedFavorites);
    this.saveToStorage(this.FAVORITES_KEY, updatedFavorites);
  }

  // ------------------ Helpers ------------------

  private roundToTwoDecimalPlaces(price: number): number {
    return Math.round(price * 100) / 100;
  }

  private saveToStorage(key: string, data: Supplement[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadFromStorage(key: string): Supplement[] {
    const raw = localStorage.getItem(key);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
      return [];
    }
  }
}