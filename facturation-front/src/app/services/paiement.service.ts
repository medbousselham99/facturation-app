import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Paiement } from '../models/paiement.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = `${environment.apiUrl}/paiements`;

  constructor(private http: HttpClient) {}

  getPaiements(): Observable<Paiement[]> {
    return this.http.get<PaginatedResponse<Paiement>>(this.apiUrl).pipe(map(r => r.data));
  }

  getPaiement(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`);
  }

  getPaiementsByFacture(factureId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}?facture_id=${factureId}`);
  }

  createPaiement(data: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(this.apiUrl, data);
  }

  updatePaiement(id: number, data: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/${id}`, data);
  }

  deletePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
