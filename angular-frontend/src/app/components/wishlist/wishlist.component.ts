import { Component } from '@angular/core';
import { Supplement } from '../../models/supplement.model';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  favoriteItems: Supplement[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.favoriteItems$.subscribe(items => {
      this.favoriteItems = items;
    });
  }

  removeFromFavorites(item: Supplement): void {
    this.sharedService.removeFromFavorites(item);
  }

}
