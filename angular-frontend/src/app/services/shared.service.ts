import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, Subject } from 'rxjs';
import { Supplement } from '../models/supplement.model';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private readonly CART_KEY = 'cart_items';
  private readonly FAVORITES_KEY = 'favorite_items';

  private cartItemsSubject = new BehaviorSubject<Supplement[]>(this.loadFromStorage(this.CART_KEY));
  private favoriteItemsSubject = new BehaviorSubject<Supplement[]>(this.loadFromStorage(this.FAVORITES_KEY));
  private cartOpenSubject = new Subject<void>();

  cartItems$ = this.cartItemsSubject.asObservable();
  favoriteItems$ = this.favoriteItemsSubject.asObservable();
  cartOpen$ = this.cartOpenSubject.asObservable();

  openCart(): void {
    this.cartOpenSubject.next();
  }

  updateCartItems(items: Supplement[]): void {
    const roundedItems = items.map(item => ({
      ...item,
      priceEuro: this.roundToTwoDecimalPlaces(item.priceEuro)
    }));
    this.cartItemsSubject.next(roundedItems);
    this.saveToStorage(this.CART_KEY, roundedItems);
  }

  addToCart(item: Supplement): void {
    const items = [...this.cartItemsSubject.value];
    const index = items.findIndex(i => i.id === item.id);

    if (index !== -1) {
      items[index] = {
        ...items[index],
        quantity: items[index].quantity + 1,
        priceEuro: this.roundToTwoDecimalPlaces(items[index].priceEuro)
      };
    } else {
      items.push({ ...item, quantity: 1, priceEuro: this.roundToTwoDecimalPlaces(item.priceEuro) });
    }

    this.updateCartItems(items);
  }

  updateItemQuantity(item: Supplement, change: number): void {
    let items = [...this.cartItemsSubject.value];
    const index = items.findIndex(i => i.id === item.id);

    if (index !== -1) {
      items[index].quantity += change;
      if (items[index].quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].priceEuro = this.roundToTwoDecimalPlaces(items[index].priceEuro);
      }
      this.updateCartItems(items);
    }
  }

  updateFavoriteItems(items: Supplement[]): void {
    this.favoriteItemsSubject.next(items);
    this.saveToStorage(this.FAVORITES_KEY, items);
  }

  addToFavorites(item: Supplement): void {
    const items = [...this.favoriteItemsSubject.value];
    if (!items.some(i => i.id === item.id)) {
      this.updateFavoriteItems([...items, item]);
    }
  }

  removeFromFavorites(item: Supplement): void {
    this.updateFavoriteItems(this.favoriteItemsSubject.value.filter(i => i.id !== item.id));
  }
    getTotalPrice(): number {
    const items = this.cartItemsSubject.value;
    const total = items.reduce((sum, item) => sum + item.priceEuro * item.quantity, 0);
    return this.roundToTwoDecimalPlaces(total);
  }

  private roundToTwoDecimalPlaces(value: number): number {
    return Math.round(value * 100) / 100;
  }

  private saveToStorage(key: string, data: Supplement[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadFromStorage(key: string): Supplement[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error(`Error loading ${key} from localStorage`, err);
      return [];
    }
  }
}
