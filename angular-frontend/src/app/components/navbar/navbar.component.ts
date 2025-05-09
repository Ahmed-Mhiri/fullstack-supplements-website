import { CommonModule } from '@angular/common';
import { Component, OnInit,ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supplement } from '../../models/supplement.model';
import { SupplementService } from '../../services/supplement.service';
import { ProductSearchCardComponent } from "../product-search-card/product-search-card.component"; 
import { SharedService } from '../../services/shared.service';
import { CartComponent } from '../cart/cart.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductSearchCardComponent, CartComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchOverlay') searchOverlay!: ElementRef;
  @ViewChild('cartComponent') cartComponent: CartComponent | undefined;
  cartCount = 0;
  favoriteCount = 0;
  isSearchActive = false;
  isMobileSearchActive = false;
  mobileSearchText = '';
  searchQuery = '';
  allProducts: Supplement[] = [];
  filteredProducts: Supplement[] = [];

  constructor(
    private supplementService: SupplementService,
    private el: ElementRef,
    private renderer: Renderer2,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart count and favorite count updates from the SharedService
    this.sharedService.cartItems$.subscribe(cartItems => {
    this.cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
      console.log('Cart Count Updated:', this.cartCount);  // Debugging log
    });

    // Subscribe to favorite items and update the favorite count
    this.sharedService.favoriteItems$.subscribe(favoriteItems => {
      this.favoriteCount = favoriteItems.length;
      console.log('Favorite Count Updated:', this.favoriteCount);  // Debugging log
    });
  
    this.supplementService.getAllSupplements().subscribe(products => {
  this.allProducts = products;
  this.filteredProducts = this.allProducts.slice(0, 3);
});
  
    // Use 'click' instead of 'mousedown'
    this.renderer.listen('document', 'click', (event: Event) => {
      setTimeout(() => { // <-- Wrap in setTimeout
        const clickedInside =
          this.searchOverlay?.nativeElement.contains(event.target) ||
          this.el.nativeElement.contains(event.target);
  
        if (!clickedInside) {
          this.isSearchActive = false;
        }
      }, 0); // Run AFTER Angular's click handler
    });
  }
  ngAfterViewInit(): void {
    this.renderer.listen(this.el.nativeElement, 'focusout', (event: FocusEvent) => {
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        const isInside = this.el.nativeElement.contains(activeElement);
        if (!isInside) {
          this.isSearchActive = false;
        }
      }, 0);
    });
  }

  // Toggle search bar visibility (desktop)
  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      this.filterProducts();
    }
  }

  // Handle focus event on search bar
  onSearchFocus(): void {
    this.isSearchActive = true;
    this.filterProducts();
  }

  // Handle blur event on search bar
  onSearchBlur(event: FocusEvent): void {
    setTimeout(() => {
      if (!this.searchOverlay.nativeElement.contains(event.relatedTarget) && !this.el.nativeElement.contains(event.relatedTarget)) {
        this.isSearchActive = false;  // Close the search overlay if focus is lost and clicked outside
      }
    }, 200);  // Delay to ensure the event is handled correctly
  }
  onSearchInputClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Handle the search icon click (toggle search visibility)
  onSearchIconClick(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleSearch();
  }


  // Open mobile search overlay
  openMobileSearch(): void {
    this.isMobileSearchActive = true;
  }

  // Close mobile search overlay
  closeMobileSearch(): void {
    this.isMobileSearchActive = false;
  }

  // Called when user types or selects a popular term
  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
    console.log('Filtering for:', query); // ✅ Debugging line
  
    const filtered = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(query)
    );
  
    this.filteredProducts = filtered.slice(0, 3); // 👈 Limit to 3 items
    console.log('Filtered Products:', this.filteredProducts); // ✅ Debugging line
  }

  // Apply a popular search term
  
  get productsToDisplay(): Supplement[] {
    return this.filteredProducts.length > 0 || this.searchQuery.trim()
      ? this.filteredProducts.slice(0, 3)
      : this.allProducts.slice(0, 3);
  }
  onCartIconClick(): void {
    this.cartComponent?.openCart();
  }
 navigateToWishlist(): void {
  this.router.navigate(['/wishlist']);
}
}
