import { Component, Input, OnInit } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SupplementService } from '../../services/supplement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-product-search-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search-card.component.html',
  styleUrl: './product-search-card.component.scss'
})
export class ProductSearchCardComponent implements OnInit  {
  @Input() supplements: Supplement[] = []; // 👈 Accepts filtered products
  totalPages: number = 0;
  totalElements: number = 0;
  currentPage: number = 0;

  constructor(private supplementService: SupplementService) { }

  ngOnInit(): void {
    this.fetchSupplements();
  }

  fetchSupplements(page: number = 0): void {
    this.supplementService.getSupplements(20, page).subscribe(response => {
      this.supplements = response.content;
      this.totalPages = response.totalPages;
      this.totalElements = response.totalElements;
      this.currentPage = page;
    });
  }

  onPageChange(newPage: number): void {
    this.fetchSupplements(newPage);
  }

}
