import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Supplement } from '../../models/supplement.model';
import { CartResumeComponent } from "../cart-resume/cart-resume.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, CartResumeComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  buyer = {
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    phoneNumber: '',
  };

  invoice = {
    country: '',
    streetAddress: '',
    zip: '',
    city: '',
  };

  payment = {
    paymentMethod: '',
    cardNumber: '',
    cardholderName: '',
    expirationDate: '',
    cvv: '',
    paypalEmail: '',
  };

  countries = [
    { name: 'USA' },
    { name: 'Germany' },
    { name: 'UK' },
    { name: 'France' },
    { name: 'Spain' },
  ];

  selectedCountryCode = '+49'; // default country code, change it based on your country's requirements
  totalPrice: number = 0; // Initialize with 0, will be updated dynamically

  cartItems: Supplement[] = []; // Local variable to store cart items

  constructor(private sharedService: SharedService, private http: HttpClient) {}

  ngOnInit(): void {
    // Subscribe to cart items and update the total price whenever the cart changes
    this.sharedService.cartItems$.subscribe((cartItems: Supplement[]) => {
      this.cartItems = cartItems; // Save the cart items locally
      this.totalPrice = this.sharedService.getTotalPrice(); // Update total price from the service
    });
  }

  onSubmit(buyerForm: NgForm): void {
  if (buyerForm.invalid) {
    alert("Please fill in all required fields.");
    return;
  }

  // Prepare the customer data (to send to the backend for customer creation/update)
  const customerData = {
    firstName: this.buyer.firstName,
    lastName: this.buyer.lastName,
    company: this.buyer.company,
    email: this.buyer.email,
    country: this.buyer.country,
    phoneNumber: this.buyer.phoneNumber,
    streetAddress: this.invoice.streetAddress,
    zip: this.invoice.zip,
    city: this.invoice.city,
  };

  // Validate if the customer data has required fields
  if (!customerData.firstName || !customerData.streetAddress) {
    alert('First name and street address are required!');
    return;
  }

  console.log("Customer Data to be sent:", customerData);

  // Prepare the order data (to send to the backend for order creation)
  const orderData = {
    customerRequest: customerData,
    supplementIds: this.cartItems.map(item => item.id),
  };
    console.log("Order Data being sent:", JSON.stringify(orderData, null, 2));

     console.log(this.cartItems);
  this.http.post('http://localhost:8080/customers', customerData)
    .subscribe(customerResponse => {
      console.log('Customer saved or updated successfully', customerResponse);

      this.http.post('http://localhost:8080/orders', orderData)
        .subscribe(orderResponse => {
          console.log('Order placed successfully', orderResponse);
        }, error => {
          console.error('Error placing order', error);
          alert('Error placing order: ' + error.message);
        });
    }, error => {
      console.error('Error saving/updating customer', error);
      alert('Error saving/updating customer: ' + error.message);
    });
}

  onPaymentMethodChange(): void {
    // Handle any logic for payment method change
    if (this.payment.paymentMethod === 'Credit Card') {
      console.log('Credit Card selected');
    } else if (this.payment.paymentMethod === 'PayPal') {
      console.log('PayPal selected');
    }
  }

  onCountryChange(): void {
    // Logic to change country code based on selected country
    if (this.buyer.country === 'USA') {
      this.selectedCountryCode = '+1';
    } else if (this.buyer.country === 'Germany') {
      this.selectedCountryCode = '+49';
    } else if (this.buyer.country === 'UK') {
      this.selectedCountryCode = '+44';
    } else if (this.buyer.country === 'France') {
      this.selectedCountryCode = '+33';
    } else if (this.buyer.country === 'Spain') {
      this.selectedCountryCode = '+34';
    }
  }
}
