import { Component, OnInit } from '@angular/core';
import { Supplement} from '../../models/supplement.model';
import { SupplementService } from '../../services/supplement.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-supplement-card',
  templateUrl: './supplement-card.component.html',
  imports: [CommonModule,FormsModule,CardModule,ButtonModule],  // Import any necessary modules here
  standalone: true,
  styleUrls: ['./supplement-card.component.scss']
})
export class SupplementCardComponent implements OnInit {
  supplements: Supplement[] = [];  // This will hold the list of supplements

  constructor(private supplementService: SupplementService) { }

  ngOnInit(): void {
    this.loadSupplements();  // Call the service to fetch supplements on component initialization
  }

  // Call the service to get all supplements
  loadSupplements(): void {
    this.supplementService.getSupplements().subscribe({
      next: (data) => {
        this.supplements = data;  // Store the fetched supplements in the component property
      },
      error: (err) => {
        console.error('Error fetching supplements:', err);  // Log error if something goes wrong
      }
    });
  }
}
