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
    // Extract the category or filter type and filter value
    const categoryOrFilter = params.get('category') || params.get('filterType');
    const filterValue = params.get('filterValue');
    const pageParam = parseInt(params.get('page') || '1', 10) - 1;

    // Correctly set the current page
    this.currentPage = isNaN(pageParam) ? 0 : pageParam;

    // Ensure supplementsPerPage is valid (greater than 0)
    const safeSize = this.supplementsPerPage > 0 ? this.supplementsPerPage : 21;

    // Conditional logic based on filter type and category
    if (params.get('filterType') && filterValue) {
      this.loadFilteredSupplements(categoryOrFilter as FilterType, filterValue, safeSize);
    } else if (categoryOrFilter) {
      this.loadSupplementsByCategory(categoryOrFilter, safeSize);
    } else {
      // Default fallback to 'protein'
      this.loadSupplementsByCategory('protein', safeSize);
    }
  });
}

  loadSupplementsByCategory(category: string, size: number): void {
    this.supplementService.getSupplements(
      this.currentPage,
      size, // Pass safeSize here
      'category',
      category
    ).subscribe((response: PaginatedResponse) => {
      this.supplements = response.content;
      this.totalPages = response.totalPages;
    });
  }

  loadFilteredSupplements(filterType: FilterType, filterValue: string, size: number): void {
    this.supplementService.getSupplements(
      this.currentPage,
      size, // Pass safeSize here
      filterType,
      filterValue
    ).subscribe((response: PaginatedResponse) => {
      console.log('API response:', response);
      this.supplements = response.content;
      this.totalPages = response.totalPages;
    });
  }

  changePage(page: number): void {
  const category = this.route.snapshot.paramMap.get('category')!;
  const filterType = this.route.snapshot.paramMap.get('filterType');
  const filterValue = this.route.snapshot.paramMap.get('filterValue');

  // If both filterType and filterValue exist, navigate to the filtered page
  if (filterType && filterValue) {
    this.router.navigate(['/supps', 'goals', filterValue, page + 1]);
  } else if (category) {
    // Navigate to the category if no filter
    this.router.navigate(['/supps', category, page + 1]);
  } else {
    // Default navigation (if no category is specified)
    this.router.navigate(['/supps', 'protein', page + 1]);
  }
}
}

