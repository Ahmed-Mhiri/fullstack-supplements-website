import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupplementService } from '../../services/supplement.service';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.scss'
})
export class UserOrdersComponent {
  customer: any = null;
  orders: any[] = [];
  constructor(
  private authService: AuthService,
  private router: Router,
  private supplementService: SupplementService
) {}

  ngOnInit() {
  const email = localStorage.getItem('userEmail');
  
  // If no email is found in localStorage, navigate to the login page
  if (!email) {
    this.router.navigate(['/login']);
    return;
  }

  // Fetch customer details using the email from localStorage
  this.authService.getCustomerDetails(email).subscribe({
    next: (data) => {
      // If no customer data is returned (i.e., user profile doesn't exist), 
      // just log it or handle accordingly without showing an error
      if (!data) {
        console.log('No profile found for this email.');
        // Optionally, display a message or show a default state
        return;
      }

      // If profile exists, proceed with setting up the customer data
      this.customer = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email
      };

      // Load each order and fetch full supplement details
      const orderPromises = data.orders.map(async (order: any) => {
        const supplementDetails = await Promise.all(
          order.supplements.map(async (supp: any) => {
            const supplement = await this.supplementService.getSupplementById(supp.supplementId).toPromise();
            return supplement
              ? { ...supplement, quantity: supp.quantity }
              : null;
          })
        );

        // Filter out any null supplements and calculate total price
        const filteredSupplements = supplementDetails.filter(s => s !== null);

        const totalPrice = filteredSupplements.reduce(
          (sum, s: any) => sum + s.priceEuro * s.quantity,
          0
        );

        return {
          ...order,
          supplements: filteredSupplements,
          totalPrice: totalPrice
        };
      });

      // Once all orders are processed, set them to the component's state
      Promise.all(orderPromises).then((ordersWithSupplements) => {
        this.orders = ordersWithSupplements;
      });
    },
    error: () => {
      // If there is an error, log it and just let the user continue
      console.log('Failed to load customer details');
      // Optionally, handle the error without navigating away or showing an alert
    }
  });
}

logout() {
  localStorage.removeItem('userEmail');
  this.router.navigate(['/login']);
}

}
