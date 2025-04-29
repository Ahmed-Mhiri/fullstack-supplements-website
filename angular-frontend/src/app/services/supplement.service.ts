import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Supplement } from '../models/supplement.model'; // Ensure this path is correct

// Interface for the paginated response
interface PaginatedResponse {
  content: Supplement[];   // The list of supplements (array)
  totalPages: number;      // Total number of pages for pagination
  totalElements: number;   // Total number of supplements available
}

@Injectable({
  providedIn: 'root'
})
export class SupplementService {
  private apiUrl = 'http://localhost:8080/api/supplements'; // API URL for your Spring Boot backend

  constructor(private http: HttpClient) { }

  // Method to get supplements with pagination
  getSupplements(limit: number = 20, page: number = 0): Observable<PaginatedResponse> {
    // Constructing the URL with query parameters for pagination
    const url = `${this.apiUrl}?page=${page}&size=${limit}`;
    return this.http.get<PaginatedResponse>(url).pipe(
      catchError(error => {
        console.error('Error fetching supplements:', error);
        return of({ content: [], totalPages: 0, totalElements: 0 }); // Return empty data in case of an error
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