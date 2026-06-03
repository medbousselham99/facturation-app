import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Facture } from '../models/facture.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = `${environment.apiUrl}/factures`;

  constructor(private http: HttpClient) {}

  getFactures(): Observable<Facture[]> {
    return this.http.get<PaginatedResponse<Facture>>(this.apiUrl).pipe(map(r => r.data));
  }

  getFacture(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }

  createFacture(data: Facture): Observable<Facture> {
    return this.http.post<Facture>(this.apiUrl, data);
  }

  updateFacture(id: number, data: Facture): Observable<Facture> {
    return this.http.put<Facture>(`${this.apiUrl}/${id}`, data);
  }

  deleteFacture(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  marquerPayee(id: number): Observable<Facture> {
    return this.http.post<Facture>(`${this.apiUrl}/${id}/payer`, {});
  }

  exportPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  envoyerEmail(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/email`, {});
  }
}
