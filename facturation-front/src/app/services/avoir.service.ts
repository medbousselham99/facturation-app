import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Avoir } from '../models/avoir.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class AvoirService {
  private apiUrl = `${environment.apiUrl}/avoirs`;

  constructor(private http: HttpClient) {}

  getAvoirs(): Observable<Avoir[]> {
    return this.http.get<PaginatedResponse<Avoir>>(this.apiUrl).pipe(map(r => r.data));
  }

  getAvoir(id: number): Observable<Avoir> {
    return this.http.get<Avoir>(`${this.apiUrl}/${id}`);
  }

  createAvoir(data: Avoir): Observable<Avoir> {
    return this.http.post<Avoir>(this.apiUrl, data);
  }

  updateAvoir(id: number, data: Avoir): Observable<Avoir> {
    return this.http.put<Avoir>(`${this.apiUrl}/${id}`, data);
  }

  deleteAvoir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
