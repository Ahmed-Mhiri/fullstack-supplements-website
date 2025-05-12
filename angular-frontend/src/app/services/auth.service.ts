import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth'; // Adjust if needed

  constructor(private http: HttpClient) {}

  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send-code`, { email });
  }

  verifyCode(email: string, code: string): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(`${this.baseUrl}/verify-code`, { email, code });
  }
}