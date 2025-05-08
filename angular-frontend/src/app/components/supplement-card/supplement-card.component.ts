import { Component, OnInit } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SupplementService } from '../../services/supplement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';


// Interface to match the paginated response from the backend
interface PaginatedResponse {
  content: Supplement[];
  totalPages: number;
  totalElements: number;
}

@Component({
  selector: 'app-supplement-card',
  templateUrl: './supplement-card.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./supplement-card.component.scss']
})
export class SupplementCardComponent implements OnInit {
  successMessageVisible = false;
  selectedSupplement: Supplement | null = null;
  supplements: Supplement[] = [];
  supplementFavorites: Supplement[] = [];
  totalPages: number = 0;
  currentPage: number = 0;

  constructor(private supplementService: SupplementService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.loadSupplements(); // Load data on init
    this.sharedService.favoriteItems$.subscribe(favorites => {
      this.supplementFavorites = favorites;  // Update the list of favorites
    });
  }

  loadSupplements(page: number = 0): void {
    this.supplementService.getSupplements(20, page).subscribe({
      next: (data: PaginatedResponse) => {
        // Initialize isFavorite on each supplement
        this.supplements = data.content.map(supp => ({
          ...supp,
          isFavorite: this.supplementFavorites.some(fav => fav.id === supp.id) // Check if it is already in favorites
        }));
        this.totalPages = data.totalPages;
        this.currentPage = page;
      },
      error: (err) => {
        console.error('Error fetching supplements:', err);
      }
    });
  }

  toggleFavorite(supplement: Supplement): void {
    supplement.isFavorite = !supplement.isFavorite;
    
    // Update favorite list
    if (supplement.isFavorite) {
      this.sharedService.addToFavorites(supplement);
    } else {
      this.sharedService.removeFromFavorites(supplement);
    }
  }

  onAddToCartClick(supplement: Supplement): void {
    this.selectedSupplement = supplement;
  }
  
  confirmAddToCart(): void {
    if (this.selectedSupplement) {
      this.sharedService.addToCart(this.selectedSupplement); // Add to cart
    }
    this.selectedSupplement = null;
    this.successMessageVisible = true;

  // Hide message after 3 seconds (optional)
  setTimeout(() => {
    this.successMessageVisible = false;
  }, 3000);
  }

  openModal(supplement: Supplement): void {
    this.selectedSupplement = supplement; // Set the selected supplement for the modal
  }

  // Close the modal when clicking outside or the close button
  closeModal(event: Event): void {
    event.stopPropagation(); // Prevent event from propagating to the overlay
    this.selectedSupplement = null; // Close the modal
  }
}
