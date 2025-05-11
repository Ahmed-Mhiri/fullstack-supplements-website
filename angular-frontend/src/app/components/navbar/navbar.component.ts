import { CommonModule } from '@angular/common';
import { Component, OnInit,ElementRef, Renderer2, ViewChild, HostListener } from '@angular/core';
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
goToProfile() {
    this.router.navigate(['/login']); // or open a dropdown instead

}
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
    this.sharedService.cartItems$.subscribe(cartItems => {
      this.cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
    });

    this.sharedService.favoriteItems$.subscribe(favoriteItems => {
      this.favoriteCount = favoriteItems.length;
    });

    this.supplementService.getAllSupplements().subscribe(products => {
      this.allProducts = products;
      this.filteredProducts = this.allProducts.slice(0, 3);
    });
  }

  // ✅ Only use HostListener to close overlay if clicked outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const clickedInside =
      this.el.nativeElement.contains(target) || 
      this.searchOverlay?.nativeElement.contains(target);

    if (!clickedInside) {
      this.isSearchActive = false;
    }
  }

  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
    if (this.isSearchActive) {
      this.filterProducts();
    }
  }

  onSearchFocus(): void {
    this.isSearchActive = true;
    this.filterProducts();
  }

  // Optional: Keep if needed, otherwise remove (not essential)
  onSearchBlur(event: FocusEvent): void {
    // No action needed due to HostListener handling
  }

  onSearchInputClick(event: MouseEvent): void {
    event.stopPropagation();
  }

onSearchIconClick(event: Event): void {
  event.stopPropagation();  // Stop event propagation

  // Toggle the search visibility
  this.toggleSearch();

  // Close the mobile search overlay if it's open
  this.closeMobileSearch();

  // Check if it's a keyboard event (for "Enter" key press)
  if (event instanceof KeyboardEvent && event.key === "Enter") {
    if (this.searchQuery.trim()) {
      // If there is a search query, navigate to the search page with the query
      this.router.navigate(['/supps', 'search', this.searchQuery, 1]);
    }
  }

  // If it's a mouse click and searchQuery is not empty, proceed with navigation
  if (event instanceof MouseEvent && this.searchQuery.trim()) {
    this.router.navigate(['/supps', 'search', this.searchQuery, 1]);
  }
}

  openMobileSearch(): void {
    this.isMobileSearchActive = true;
  }

  closeMobileSearch(): void {
    this.isMobileSearchActive = false;
  }

  filterProducts(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const filtered = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(query)
    );
    this.filteredProducts = filtered.slice(0, 3);
  }

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
  onProductCardClicked(product: Supplement): void {
    this.isSearchActive = false; // Close the search overlay
    this.isMobileSearchActive = false;
  }
}
