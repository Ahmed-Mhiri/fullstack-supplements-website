import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { SupplementCardComponent } from './components/supplement-card/supplement-card.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ProductCategoryStripComponent } from "./components/product-category-strip/product-category-strip.component";
import { ProductSearchCardComponent } from "./components/product-search-card/product-search-card.component";
import { CartComponent } from "./components/cart/cart.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, InputTextModule, ButtonModule, MessageModule, FormsModule, SupplementCardComponent, NavbarComponent, ProductCategoryStripComponent, ProductSearchCardComponent, CartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  text = '';

  msg = '';

  onClick() {
    this.msg = 'Welcome ' + this.text;
  }
  lastScrollTop: number = 0;
  navbarContainer: HTMLElement | null = null;

  constructor() {}

  ngOnInit() {
    // Get the navbar container element
    this.navbarContainer = document.querySelector('.navbar-container');
  }

  // Detect scroll events and update the navbar's position
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!this.navbarContainer) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop) {
      // Scrolling down, hide the navbar
      this.navbarContainer.style.top = "-100px";  // Adjust this value based on navbar height
    } else {
      // Scrolling up, show the navbar
      this.navbarContainer.style.top = "0";
    }

    // Update the last scroll position
    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}
