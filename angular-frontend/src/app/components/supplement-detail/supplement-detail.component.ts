import { Component, OnInit } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { ActivatedRoute } from '@angular/router';
import { SupplementService } from '../../services/supplement.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule here


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
    private supplementService: SupplementService
  ) {}

ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  
  if (id) {
    this.supplementService.getSupplementById(id).subscribe((data) => {
      // Ensure that data.goals is a string
      if (typeof data.goals === 'string') {
        // Clean up the goals string and convert to an array
        const rawGoals = (data.goals as string) // type assertion here
          .replace(/[\[\]']+/g, '') // Remove unwanted characters
          .split(',') // Split string by commas
          .map(g => g.trim()); // Trim each goal
          
        this.supplement = { 
          ...data, 
          goals: rawGoals 
        };
      } else {
        // If goals is already an array, just assign it
        this.supplement = data;
      }
    });
  }
}}
