import { Component } from '@angular/core';
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
export class LoginComponent {
  email: string = '';
  verificationCode: string = '';
  codeSent: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.codeSent) {
      // Step 1: Send code
      this.authService.sendVerificationCode(this.email).subscribe(() => {
        this.codeSent = true;
        alert('A verification code was sent to your email.');
      });
    } else {
      // Step 2: Verify code
      this.authService.verifyCode(this.email, this.verificationCode).subscribe(
        (res) => {
          if (res.valid) {
            this.router.navigate(['/user-orders']);
          } else {
            alert('Invalid or expired code.');
          }
        }
      );
    }
  }

  resendCode(event: Event) {
    event.preventDefault();
    this.authService.sendVerificationCode(this.email).subscribe(() => {
      alert('New code sent!');
    });
  }

}
