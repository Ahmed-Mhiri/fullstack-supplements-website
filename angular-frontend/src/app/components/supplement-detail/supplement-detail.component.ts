import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupplementService } from '../../services/supplement.service';
import { SharedService } from '../../services/shared.service';
import { Supplement } from '../../models/supplement.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule here

@Component({
  selector: 'app-supplement-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supplement-detail.component.html',
  styleUrls: ['./supplement-detail.component.scss']  // Corrected styleUrls
})
export class SupplementDetailComponent implements OnInit {
  supplement: Supplement | null = null;

  constructor(
    private route: ActivatedRoute,
    private supplementService: SupplementService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes (id)
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!id) {
        // Handle case where id is not valid
        console.error('Invalid Supplement ID');
        return;
      }

      // Fetch new supplement data when the id changes
      this.supplementService.getSupplementById(id).subscribe(
        (data) => {
          if (data) {
            // Parse goals if necessary
            const goals = this.parseGoals(data.goals);
            
            // Ensure id is a valid number
            const supplement: Supplement = { 
              ...data, 
              goals,
              id: data.id ?? 0,  // Ensure 'id' is always a number (use 0 if 'id' is undefined)
            };
            
            this.supplement = supplement;
          }
        },
        (error) => {
          // Handle error if fetching the supplement fails
          console.error('Error fetching supplement:', error);
        }
      );
    });
  }

  handleBuyClick(): void {
    if (this.supplement) {
      this.sharedService.addToCart(this.supplement);
      this.sharedService.openCart();
    }
  }

  private parseGoals(goals: string | string[]): string[] {
    if (Array.isArray(goals)) {
      return goals.map((g) => g.trim());
    }

    return goals
      .replace(/[\[\]']+/g, '') // Remove brackets and single quotes
      .split(',')
      .map((g) => g.trim());
  }
}
