import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Supplement } from '../models/supplement.model'; // Ensure this path is correct
import { PaginatedResponse } from '../models/paginated-response'; // Ensure this path is correct  

@Injectable({
  providedIn: 'root'
})
export class SupplementService {
   private apiUrl = 'https://suppstore-d4a57eabc73b.herokuapp.com/api/supplements'; // Your confirmed correct backend URL

  constructor(private http: HttpClient) {}

  // Get supplements with pagination and multiple filters
getSupplements(
  page: number,
  size: number,
  filterType: 'category' | 'goals' | 'brand',
  filterValue: string
): Observable<PaginatedResponse> {
  // Validate size before making the request
  const validSize = size > 0 ? size : 20;  // Default size is 20 if invalid

  // Build the request parameters
  const params: any = { page, size: validSize };

  // Add the filter parameters based on the filterType and filterValue
  if (filterType && filterValue) {
    if (filterType === 'category') {
      params['category'] = filterValue;  // No encoding applied
    } else if (filterType === 'goals') {
      params['goals'] = filterValue;  // No encoding applied
    } else if (filterType === 'brand') {
      params['brand'] = filterValue;  // No encoding applied
    }
  }

  // Make the HTTP GET request with the dynamic params
  return this.http.get<PaginatedResponse>(this.apiUrl, { params });
}

  // Get supplements by search query (for name search)
  getSupplementsBySearchQuery(query: string, page: number, size: number): Observable<PaginatedResponse> {
  return this.http.get<PaginatedResponse>(`${this.apiUrl}/search`, {
    params: new HttpParams()
      .set('query', query)   // Add the search query
      .set('page', page.toString())  // Add the page number
      .set('size', size.toString())  // Add the page size
  }).pipe(
    catchError(error => {
      console.error('Failed to search supplements', error);  // Log the error for debugging
      return of({ content: [], totalElements: 0, totalPages: 0 });  // Return an empty paginated response
    })
  );
}

  // Get all supplements without pagination
  getAllSupplements(): Observable<Supplement[]> {
    return this.http.get<Supplement[]>(`${this.apiUrl}/all`).pipe(
      catchError(error => {
        console.error('Failed to load all supplements', error);
        return of([]);  // Return an empty array if the request fails
      })
    );
  }

  // Get a single supplement by its id
  getSupplementById(id: number): Observable<Supplement | null> {
  return this.http.get<Supplement>(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      console.error('Failed to load supplement by ID', error);
      return of(null);  // Return null if the supplement is not found
    })
  );
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
