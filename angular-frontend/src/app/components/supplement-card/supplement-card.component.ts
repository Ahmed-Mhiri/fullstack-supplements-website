import { Component, Input } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SupplementService } from '../../services/supplement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';


// Interface to match the paginated response from the backend

@Component({
  selector: 'app-supplement-card',
  templateUrl: './supplement-card.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./supplement-card.component.scss']
})
export class SupplementCardComponent  {
  successMessageVisible = false;
  selectedSupplement: Supplement | null = null;
  @Input() supplements: Supplement[] = [];
  supplementFavorites: Supplement[] = [];
  totalPages: number = 0;
  currentPage: number = 0;

  constructor(private supplementService: SupplementService, private sharedService: SharedService,  private router: Router // Inject router
) {}

  toggleFavorite(supplement: Supplement,event: MouseEvent): void {
    event.stopPropagation();
    supplement.isFavorite = !supplement.isFavorite;
    
    // Update favorite list
    if (supplement.isFavorite) {
      this.sharedService.addToFavorites(supplement);
    } else {
      this.sharedService.removeFromFavorites(supplement);
    }
  }

  onAddToCartClick(supplement: Supplement,event: MouseEvent): void {
    event.stopPropagation();
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
  navigateToDetail(supplement: Supplement): void {
  this.router.navigate(['/supplements', supplement.id]);
}
}
