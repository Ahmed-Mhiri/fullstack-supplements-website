import { Component } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: Supplement[] = [];
  totalAmount = 0;
  isCartOpen = false;

  constructor(private sharedService: SharedService, private router : Router) {}

  ngOnInit(): void {
    this.sharedService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.updateTotalAmount();
    });

    this.sharedService.cartOpen$.subscribe(() => this.openCart());
  }

  openCart(): void {
    this.isCartOpen = true;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  updateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce(
      (sum, item) => sum + item.priceEuro * item.quantity,
      0
    );
  }

  updateItemQuantity(item: Supplement, change: number): void {
    this.sharedService.updateItemQuantity(item, change);
  }

  removeItem(item: Supplement): void {
    this.sharedService.updateCartItems(
      this.cartItems.filter(i => i.id !== item.id)
    );
  }

  clearCart(): void {
    this.sharedService.updateCartItems([]);
  }
   goToCheckout(): void {
    this.closeCart(); // Close the cart overlay
    this.router.navigate(['/checkout']); // Navigate to the checkout route
  }
}
