import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { SupplementCardComponent } from './components/supplement-card/supplement-card.component';
import { HttpClientModule } from '@angular/common/http';  // Import HttpClientModule


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HttpClientModule, InputTextModule, ButtonModule, MessageModule, FormsModule, SupplementCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  text = '';

  msg = '';

  onClick() {
    this.msg = 'Welcome ' + this.text;
  }
}
