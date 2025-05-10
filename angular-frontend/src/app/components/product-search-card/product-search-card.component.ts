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
  styleUrl: './product-search-card.component.scss'
})
export class ProductSearchCardComponent implements OnInit {
  @Input() supplements: Supplement[] = [];
  @Output() productClick: EventEmitter<Supplement> = new EventEmitter<Supplement>();
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;

  readonly pageSize = 20;

  constructor(private supplementService: SupplementService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSupplements(); // Optionally, you can remove this if data is always passed via @Input()
  }

  fetchSupplements(page: number = 0): void {
    this.supplementService.getSupplements(page, this.pageSize).subscribe(response => {
      this.supplements = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
      this.currentPage = page;
    });
  }

  onPageChange(newPage: number): void {
    this.fetchSupplements(newPage);
  }

  onCardClick(event: Event, product: Supplement): void {
    event.stopPropagation();  // Stop event propagation to avoid triggering other click events
    this.productClick.emit(product);  // Emit the clicked product
    this.router.navigate(['/supplements', product.id]);  // Navigate to the supplement page
  }

}
