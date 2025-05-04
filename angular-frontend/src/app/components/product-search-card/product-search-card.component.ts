import { Component } from '@angular/core';

@Component({
  selector: 'app-product-search-card',
  standalone: true,
  imports: [],
  templateUrl: './product-search-card.component.html',
  styleUrl: './product-search-card.component.scss'
})
export class ProductSearchCardComponent {
  supplement = {
    id: 1,
    name: 'Impact Whey Protein Powder',
    priceEuro: 15.65,
    imageUrl: 'https://www.myprotein.com/images?url=https://static.thcdn.com/productimg/original/10530943-9515180485700898.jpg&format=webp&auto=avif&width=450&height=450&fit=crop',
    productUrl: 'https://www.myprotein.com/p/sports-nutrition/impact-whey-protein-powder/10530943/',
    flavor: 'Vanilla',
    weightVolume: '500g',
    brand: 'myprotein',
    category: 'Protein',
    goals: ['Muscle growth', 'Bodybuilding', 'Muscle building', 'Endurance', 'Recovery', 'Strength', 'Mass building']
  };

}
