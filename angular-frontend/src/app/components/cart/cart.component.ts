import { Component } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: Supplement[] = [];
  totalAmount: number = 0;
  isCartOpen: boolean = false;  // To track if the cart is open or not


  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    // Subscribe to cartItems$ to get updated cart data from the service
    this.sharedService.cartItems$.subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.updateTotalAmount();
    });
  }
  openCart(): void {
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }


  // Update total amount whenever cart changes
  updateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + item.priceEuro * item.quantity, 0);
  }

  // Increase or decrease the quantity of an item in the cart
  updateItemQuantity(item: Supplement, change: number): void {
    const updatedCart = this.cartItems
      .map(cartItem => {
        if (cartItem.id === item.id) {
          const newQuantity = cartItem.quantity + change;
  
          // If new quantity is zero or less, we return null to remove it
          if (newQuantity <= 0) {
            return null;
          }
  
          return { ...cartItem, quantity: newQuantity };
        }
        return cartItem;
      })
      .filter((item): item is Supplement => item !== null); // Remove nulls (deleted items)
  
    this.sharedService.updateCartItems(updatedCart);
  }

  // Remove a specific item from the cart
  removeItem(item: Supplement): void {
    const updatedCart = this.cartItems.filter((cartItem) => cartItem.id !== item.id);
    this.sharedService.updateCartItems(updatedCart); // Remove the item
  }

  // Clear all items from the cart
  clearCart(): void {
    this.sharedService.updateCartItems([]); // Clear the cart
  }

}
