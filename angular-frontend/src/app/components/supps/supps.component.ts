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
  supplementsPerPage = 21;
  totalPages = 0;

  constructor(
    private supplementService: SupplementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const category = params.get('category')!;
      const filterType = params.get('filterType') as FilterType | null;
      const filterValue = params.get('filterValue');
      const pageParam = parseInt(params.get('page') || '1', 10) - 1;
  
      this.currentPage = isNaN(pageParam) ? 0 : pageParam;
  
      if (filterType && filterValue) {
        this.loadFilteredSupplements(filterType, filterValue);
      } else {
        this.loadSupplementsByCategory(category);
      }
    });
  }

  loadSupplementsByCategory(category: string): void {
    this.supplementService.getSupplements(
      this.currentPage,
      this.supplementsPerPage,
      'category',
      category
    ).subscribe((response: PaginatedResponse) => {
      this.supplements = response.content;
      this.totalPages = response.totalPages;
    });
  }

  loadFilteredSupplements(filterType: FilterType, filterValue: string): void {
    this.supplementService.getSupplements(
      this.currentPage,
      this.supplementsPerPage,
      filterType,
      filterValue
    ).subscribe((response: PaginatedResponse) => {
      this.supplements = response.content;
      this.totalPages = response.totalPages;
    });
  }

  changePage(page: number): void {
    const category = this.route.snapshot.paramMap.get('category')!;
    const filterType = this.route.snapshot.paramMap.get('filterType');
    const filterValue = this.route.snapshot.paramMap.get('filterValue');

    if (filterType && filterValue) {
      this.router.navigate(['/supps', category, filterType, filterValue, page + 1]);
    } else {
      this.router.navigate(['/supps', category, page + 1]);
    }
  }
}