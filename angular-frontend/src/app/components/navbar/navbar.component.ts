import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isSearchActive = false;
  isMobileSearchActive = false;
  mobileSearchText = '';

  // Toggle search bar visibility (desktop)
  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
  }

  // Handle focus event on search bar
  onSearchFocus(): void {
    this.isSearchActive = true;
  }

  // Handle blur event on search bar
  onSearchBlur(): void {
    setTimeout(() => {
      this.isSearchActive = false;
    }, 200);
  }

  // Open mobile search overlay
  openMobileSearch(): void {
    this.isMobileSearchActive = true;
  }

  // Close mobile search overlay
  closeMobileSearch(): void {
    this.isMobileSearchActive = false;
  }

}
