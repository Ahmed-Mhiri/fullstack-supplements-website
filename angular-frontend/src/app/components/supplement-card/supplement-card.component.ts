import { Component, OnInit } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SupplementService } from '../../services/supplement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Interface to match the paginated response from the backend
interface PaginatedResponse {
  content: Supplement[];   // Array of supplements
  totalPages: number;      // Total number of pages
  totalElements: number;   // Total number of supplements
}

@Component({
  selector: 'app-supplement-card',
  templateUrl: './supplement-card.component.html',
  imports: [CommonModule, FormsModule, CardModule, ButtonModule],  // Import any necessary modules here
  standalone: true,
  styleUrls: ['./supplement-card.component.scss']
})
export class SupplementCardComponent implements OnInit {
  supplements: Supplement[] = [];  // This will hold the list of supplements
  totalPages: number = 0;          // To store total pages for pagination
  currentPage: number = 0;         // To store the current page number

  constructor(private supplementService: SupplementService) { }

  ngOnInit(): void {
    this.loadSupplements();  // Call the service to fetch supplements on component initialization
  }

  // Call the service to get supplements with pagination
  loadSupplements(page: number = 0): void {
    this.supplementService.getSupplements(20, page).subscribe({
      next: (data: PaginatedResponse) => {
        this.supplements = data.content;   // Extracting the content (supplements) from the response
        this.totalPages = data.totalPages; // Storing the total pages for pagination
        this.currentPage = page;           // Storing the current page number
      },
      error: (err) => {
        console.error('Error fetching supplements:', err);  // Log error if something goes wrong
      }
    });
  }

  // Method to go to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.loadSupplements(this.currentPage + 1);  // Load next page
    }
  }

  // Method to go to the previous page
  previousPage(): void {
    if (this.currentPage > 0) {
      this.loadSupplements(this.currentPage - 1);  // Load previous page
    }
  }
}
