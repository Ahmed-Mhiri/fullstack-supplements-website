import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SupplementService } from '../../services/supplement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-search-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search-card.component.html',
  styleUrls: ['./product-search-card.component.scss']
})
export class ProductSearchCardComponent implements OnInit {
  @Input() supplements: Supplement[] = [];
  @Output() productClick: EventEmitter<Supplement> = new EventEmitter<Supplement>();
  @Input() searchQuery: string = '';  // Input for the search query (new addition)
  
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;

  readonly pageSize = 20;

  constructor(private supplementService: SupplementService, private router: Router) {}

  ngOnInit(): void {
    // Fetch supplements when component initializes (based on search query)
    this.fetchSupplements();
  }

  // Modify fetchSupplements to use the search query if provided
  fetchSupplements(page: number = this.currentPage): void {
  if (this.searchQuery) {
    // Use the search query and pass dummy values for filterType and filterValue
    this.supplementService.getSupplementsBySearchQuery(this.searchQuery, page, this.pageSize)
      .subscribe(response => {
        this.supplements = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = page;
      });
  } else {
    // If no search query, use a default filter (for example, 'category' and 'all')
    this.supplementService.getSupplements(page, this.pageSize, 'category', 'all')
      .subscribe(response => {
        this.supplements = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.currentPage = page;
      });
  }
}

  onPageChange(newPage: number): void {
    this.fetchSupplements(newPage);  // Call fetchSupplements when the page changes
  }

  onCardClick(event: Event, product: Supplement): void {
    event.stopPropagation();  // Stop event propagation to avoid triggering other click events
    this.productClick.emit(product);  // Emit the clicked product
    this.router.navigate(['/supplements', product.id]);  // Navigate to the supplement page
  }

}
