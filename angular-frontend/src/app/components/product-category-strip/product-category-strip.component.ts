import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-product-category-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-category-strip.component.html',
  styleUrl: './product-category-strip.component.scss'
})
export class ProductCategoryStripComponent {
  constructor(private router: Router) {
  // Collapse sidebar after any navigation ends
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.expandedCategoryIndex = null;
    });
}

  categories = [
    {
      title: 'Sports Nutrition',
      items: [
        'Protein', 'Amino Acids', 'Boosters', 'Carbohydrates', 'Creatine',
        'Fitness Food', 'Fitness Packages', 'Minerals', 'Vitamins', 'Weight Gainers', 'Other'
      ]
    },
    {
      title: 'Dietary Supplement',
      items: [
        'Vitamins', 'Minerals', 'Fitness Packages', 'Other'
      ]
    },
    {
      title: 'Goals',
      items: [
        'Bodybuilding', 'Bone health', 'Endurance', 'Energy', 'General health', 'Health',
        'Immune support', 'Mass building', 'Muscle building', 'Muscle function', 'Muscle growth',
        'Performance', 'Recovery', 'Strength', 'Weight loss'
      ]
    },
    {
      title: 'Brands',
      items: [
        'allstars', 'bodylab24', 'esn', 'myprotein'
      ]
    }
  ];

  isSidebarOpen = false;
  expandedCategoryIndex: number | null = null;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleCategory(index: number): void {
    this.expandedCategoryIndex = this.expandedCategoryIndex === index ? null : index;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent): void {
    if (this.isSidebarOpen) {
      this.toggleSidebar();
    }
  }

navigateToFilter(category: string, item?: string): void {
  const page = 1;

  let route: any[] = [];

  if (category === 'Goals' && item) {
    route = ['/supps', 'goals', item, page];
  } else if (category === 'Brands' && item) {
    route = ['/supps', 'brand', item, page];
  } else if (item) {
    route = ['/supps', item.toLowerCase(), page];
  } else {
    route = ['/supps', category.toLowerCase(), page];
  }

  // Navigate and wait for it to complete
  this.router.navigate(route).then(success => {
    if (success) {
      this.expandedCategoryIndex = null; // ✅ Collapse properly
      this.isSidebarOpen = false;        // ✅ close sidebar

    }
  });
}
}
