import { Component, HostListener, Input } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-cart-resume',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart-resume.component.html',
  styleUrl: './cart-resume.component.scss'
})
export class CartResumeComponent {
  cartItems: Supplement[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  get totalAmount(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.priceEuro * item.quantity,
      0
    );
  }
  scrolledDown = false;
  private lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop && scrollTop > 60) {
      // Scrolling down
      this.scrolledDown = true;
    } else if (scrollTop < this.lastScrollTop) {
      // Scrolling up
      this.scrolledDown = false;
    }

    // Update last scroll position
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

}
