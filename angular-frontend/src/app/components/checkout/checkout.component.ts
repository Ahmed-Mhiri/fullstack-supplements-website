import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Supplement } from '../../models/supplement.model';
import { CartResumeComponent } from "../cart-resume/cart-resume.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule, CartResumeComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
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

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    // Subscribe to cart items and update the total price whenever the cart changes
    this.sharedService.cartItems$.subscribe((cartItems: Supplement[]) => {
      this.totalPrice = this.sharedService.getTotalPrice(); // Update total price from the service
    });
  }

  onSubmit(form: any): void {
    if (form.valid) {
      console.log('Form submitted', this.buyer, this.invoice, this.payment);
      alert('Order submitted!');
    } else {
      alert('Please fill all required fields.');
    }
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

