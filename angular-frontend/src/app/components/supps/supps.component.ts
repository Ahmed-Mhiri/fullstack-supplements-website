import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplementService } from '../../services/supplement.service';
import { Supplement } from '../../models/supplement.model';
import { PaginatedResponse } from '../../models/paginated-response';
import { CommonModule } from '@angular/common';
import { SupplementCardComponent } from '../supplement-card/supplement-card.component';

type FilterType = 'category' | 'goals' | 'brand';

@Component({
  selector: 'app-supps',
  standalone: true,
  imports: [CommonModule, SupplementCardComponent],
  templateUrl: './supps.component.html',
  styleUrls: ['./supps.component.scss']
})
export class SuppsComponent implements OnInit {
  supplements: Supplement[] = [];
  currentPage = 0;
  supplementsPerPage = 21; // Default page size
  totalPages = 0;

  constructor(
    private supplementService: SupplementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

 ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    // Get the possible parameters from the URL
    const categoryOrFilter = params.get('category') || params.get('filterType');
    const filterValue = params.get('filterValue');
    const pageParam = parseInt(params.get('page') || '1', 10) - 1; // 0-based page index for the API

    this.currentPage = isNaN(pageParam) ? 0 : pageParam;

    // If the filterType is 'search', handle it as a search query
    const searchQuery = categoryOrFilter === 'search' && filterValue; // Check if it's a search query
    if (searchQuery) {
      // Call the search API with the search query
      this.loadSupplementsBySearchQuery(filterValue);
    } 
    // If both categoryOrFilter and filterValue are present, load filtered supplements (by category/goal/brand)
    else if (categoryOrFilter && filterValue) {
      this.loadFilteredSupplements(categoryOrFilter as FilterType, filterValue, 21);
    } 
    // If only categoryOrFilter is present (but no filterValue), load supplements by category
    else if (categoryOrFilter) {
      this.loadSupplementsByCategory(categoryOrFilter, 21);
    } 
    // Default fallback to 'protein' if no category or filter is found
    else {
      this.loadSupplementsByCategory('protein', 21);
    }
  });
}

  // Load supplements based on a search query
  loadSupplementsBySearchQuery(query: string): void {
    this.supplementService.getSupplementsBySearchQuery(query, this.currentPage, 21).subscribe((response: PaginatedResponse) => {
      this.supplements = response.content;
      this.totalPages = response.totalPages;
    });
  }

  // Load supplements based on a category
  loadSupplementsByCategory(category: string, size: number): void {
    this.supplementService.getSupplements(
      this.currentPage,
      size, // Pass page size here
      'category', // The filter type is 'category'
      category // The actual category (e.g., 'protein')
    ).subscribe((response: PaginatedResponse) => {
      this.supplements = response.content;
      this.totalPages = response.totalPages;
    });
  }

  // Load supplements based on filters (category, goals, or brand)
  loadFilteredSupplements(filterType: FilterType, filterValue: string, size: number): void {
  // Pass the filterValue directly without encoding
  this.supplementService.getSupplements(
    this.currentPage,
    size, // Page size
    filterType, // 'category', 'goals', or 'brand'
    filterValue // The actual filter value (e.g., 'Bodybuilding') without encoding
  ).subscribe((response: PaginatedResponse) => {
    this.supplements = response.content;
    this.totalPages = response.totalPages;
  });
}

  // Navigate to a different page
  changePage(page: number): void {
    const category = this.route.snapshot.paramMap.get('category');
    const filterType = this.route.snapshot.paramMap.get('filterType');
    const filterValue = this.route.snapshot.paramMap.get('filterValue');

    // If both filterType and filterValue exist, navigate to the filtered page
    if (filterType && filterValue) {
      this.router.navigate(['/supps', filterType, filterValue, page + 1]);
    } 
    // If only category exists, navigate to the category page
    else if (category) {
      this.router.navigate(['/supps', category, page + 1]);
    } 
    // Default navigation to 'protein' if no category or filter
    else {
      this.router.navigate(['/supps', 'protein', page + 1]);
    }
  }
}
