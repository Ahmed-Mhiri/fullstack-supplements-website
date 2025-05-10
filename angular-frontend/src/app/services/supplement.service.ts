import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Supplement } from '../models/supplement.model'; // Ensure this path is correct
import { PaginatedResponse } from '../models/paginated-response'; // Ensure this path is correct  

@Injectable({
  providedIn: 'root'
})
export class SupplementService {
   private apiUrl = 'http://localhost:8080/api/supplements'; // Your confirmed correct backend URL

  constructor(private http: HttpClient) {}

  // Get supplements with pagination and multiple filters
getSupplements(
  page: number,
  size: number,
  filterType?: 'category' | 'goals' | 'brand',
  filterValue?: string
): Observable<PaginatedResponse> {
  // Validate size before making the request
  const validSize = size > 0 ? size : 21;

  // Build the request parameters
  const params: any = { page, size: validSize };
  if (filterType && filterValue) {
    params[filterType] = filterValue;
  }

  return this.http.get<PaginatedResponse>(this.apiUrl, { params });
}

  // Get all supplements without pagination
  getAllSupplements(): Observable<Supplement[]> {
    return this.http.get<Supplement[]>(`${this.apiUrl}/all`).pipe(
      catchError(error => {
        console.error('Failed to load all supplements', error);
        return of([]);
      })
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
  getSupplementsBySearchQuery(query: string, page: number, size: number): Observable<PaginatedResponse> {
  return this.http.get<PaginatedResponse>(`${this.apiUrl}/search`, {
    params: new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString())
  });

}
}
