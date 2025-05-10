import { Component, OnInit } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { ActivatedRoute } from '@angular/router';
import { SupplementService } from '../../services/supplement.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule here
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-supplement-detail',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './supplement-detail.component.html',
  styleUrl: './supplement-detail.component.scss'
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
      if (!id) return;

      // Fetch new supplement data when the id changes
      this.supplementService.getSupplementById(id).subscribe(data => {
        const goals = this.parseGoals(data.goals);
        this.supplement = { ...data, goals };
      });
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
      return goals.map(g => g.trim());
    }

    return goals
      .replace(/[\[\]']+/g, '') // Remove brackets and single quotes
      .split(',')
      .map(g => g.trim());
  }
}

