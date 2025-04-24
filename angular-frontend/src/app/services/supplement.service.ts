import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Supplement } from '../models/supplement.model'; // Import the Supplement model

@Injectable({
  providedIn: 'root'
})
export class SupplementService {

  private apiUrl = 'http://localhost:8080/api/supplements'; // Your backend API URL

  constructor(private http: HttpClient) { }

  // Method to get all supplements from the API
  getSupplements(): Observable<Supplement[]> {
    return this.http.get<Supplement[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching supplements:', error);
        return of([]); // Return an empty array in case of error
      })
    );
  }

  // Method to get a single supplement by id (optional, depending on your needs)
  getSupplementById(id: number): Observable<Supplement> {
    return this.http.get<Supplement>(`${this.apiUrl}/${id}`); // Returns a single Supplement by id
  }

  // Method to add a new supplement (optional)
  addSupplement(supplement: Supplement): Observable<Supplement> {
    return this.http.post<Supplement>(this.apiUrl, supplement); // Sends POST request to add a supplement
  }

  // Method to update a supplement (optional)
  updateSupplement(id: number, supplement: Supplement): Observable<Supplement> {
    return this.http.put<Supplement>(`${this.apiUrl}/${id}`, supplement); // PUT request for updating
  }

  // Method to delete a supplement (optional)
  deleteSupplement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // Sends DELETE request to remove a supplement
  }
}
