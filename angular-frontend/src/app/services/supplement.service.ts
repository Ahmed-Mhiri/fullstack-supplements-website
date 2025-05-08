import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Supplement } from '../models/supplement.model'; // Ensure this path is correct
import { PaginatedResponse } from '../models/paginated-response'; // Ensure this path is correct  

@Injectable({
  providedIn: 'root'
})
export class SupplementService {
  private apiUrl = 'http://localhost:8080/api/supplements'; // Corrected API URL for your backend

  constructor(private http: HttpClient) { }

  // Method to get supplements with pagination and filtering
  getSupplements(
    page: number,
    size: number,
    filterType?: 'category' | 'goals' | 'brand',
    filterValue?: string
  ): Observable<PaginatedResponse> {
    const params: any = { page, size };
    if (filterType && filterValue) {
      params[filterType] = filterValue;
    }
    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  // Get all supplements without pagination
  getAllSupplements(): Observable<Supplement[]> {
    return this.http.get<PaginatedResponse>(`${this.apiUrl}?page=0&size=1000`)
      .pipe(
        catchError(error => {
          console.error('Failed to load supplements', error);
          return of({ content: [], totalPages: 0, totalElements: 0 } as PaginatedResponse);
        }),
        map(response => response.content)
      );
  }

  // Method to get a single supplement by id
  getSupplementById(id: number): Observable<Supplement> {
    return this.http.get<Supplement>(`${this.apiUrl}/${id}`);
  }

  // Method to add a new supplement
  addSupplement(supplement: Supplement): Observable<Supplement> {
    return this.http.post<Supplement>(this.apiUrl, supplement);
  }

  // Method to update a supplement
  updateSupplement(id: number, supplement: Supplement): Observable<Supplement> {
    return this.http.put<Supplement>(`${this.apiUrl}/${id}`, supplement);
  }

  // Method to delete a supplement
  deleteSupplement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
