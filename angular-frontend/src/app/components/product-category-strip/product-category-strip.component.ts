import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-product-category-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-category-strip.component.html',
  styleUrl: './product-category-strip.component.scss'
})
export class ProductCategoryStripComponent {
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
    },
    {
      title: 'Offers',
      items: [] // Can be added later
    }
  ];
  isSidebarOpen = false;

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}
expandedCategoryIndex: number | null = null;

toggleCategory(index: number): void {
  this.expandedCategoryIndex = this.expandedCategoryIndex === index ? null : index;
}

@HostListener('document:keydown.escape', ['$event'])
onEscapePress(event: KeyboardEvent): void {
  if (this.isSidebarOpen) {
    this.toggleSidebar();
  }
}
}
