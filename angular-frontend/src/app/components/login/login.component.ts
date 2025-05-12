import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  email: string = '';
  verificationCode: string = '';
  codeSent: boolean = false;
  isLoading: boolean = false;
  codeSentMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    
    // Check if user is already logged in
    const email = localStorage.getItem('userEmail');
    if (email) {
      // Redirect to user orders if the user is already logged in
      this.router.navigate(['/user-orders']);
    }
  }


  onSubmit() {
  if (this.isLoading) return; // Prevent clicks while loading

  this.isLoading = true;

  if (!this.codeSent) {
    // Step 1: Send code
    this.authService.sendVerificationCode(this.email).subscribe({
      next: () => {
        this.codeSent = true;
        this.codeSentMessage = '✅ Verification code sent to your email.';
        this.isLoading = false;
      },
      error: () => {
        this.codeSentMessage = '❌ Failed to send verification code.';
        this.isLoading = false;
      }
    });
  } else {
    // Step 2: Verify code
    this.authService.verifyCode(this.email, this.verificationCode).subscribe({
      next: (res) => {
        if (res.valid) {
          localStorage.setItem('userEmail', this.email);
          this.router.navigate(['/user-orders']);
        } else {
          this.codeSentMessage = '❌ Invalid or expired code.';
          this.isLoading = false;
        }
      },
      error: () => {
        this.codeSentMessage = '❌ Something went wrong.';
        this.isLoading = false;
      }
    });
  }
}


  resendCode(event: Event) {
  event.preventDefault();
  if (this.isLoading) return;

  this.isLoading = true;
  this.authService.sendVerificationCode(this.email).subscribe({
    next: () => {
      this.codeSentMessage = '✅ New verification code sent!';
      this.isLoading = false;
    },
    error: () => {
      this.codeSentMessage = '❌ Failed to resend code.';
      this.isLoading = false;
    }
  });
}

}
