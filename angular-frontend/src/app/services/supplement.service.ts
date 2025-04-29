import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Supplement } from '../models/supplement.model'; // Ensure this path is correct

@Injectable({
  providedIn: 'root'
})
export class SupplementService {
  private apiUrl = 'http://localhost:8080/api/supplements'; // API URL for your Spring Boot backend

  constructor(private http: HttpClient) { }

  // Method to get all supplements from the API
  getSupplements(): Observable<Supplement[]> {
    return this.http.get<Supplement[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching supplements:', error);
        return of([]); // Return an empty array in case of an error
      })
    );
  }

  // Method to get a single supplement by id
  getSupplementById(id: number): Observable<Supplement> {
    return this.http.get<Supplement>(`${this.apiUrl}/${id}`);  // Correct API endpoint
  }

  // Method to add a new supplement
  addSupplement(supplement: Supplement): Observable<Supplement> {
    return this.http.post<Supplement>(this.apiUrl, supplement); // Sends POST request to add a supplement
  }

  // Method to update a supplement
  updateSupplement(id: number, supplement: Supplement): Observable<Supplement> {
    return this.http.put<Supplement>(`${this.apiUrl}/${id}`, supplement); // PUT request for updating
  }

  // Method to delete a supplement
  deleteSupplement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // DELETE request to remove a supplement
  }
}
