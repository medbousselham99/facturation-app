import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LigneDevis } from '../models/ligne-devis.model';

@Injectable({
  providedIn: 'root'
})
export class LigneDevisService {
  private apiUrl = `${environment.apiUrl}/lignes-devis`;

  constructor(private http: HttpClient) {}

  getLignesByDevis(devisId: number): Observable<LigneDevis[]> {
    return this.http.get<LigneDevis[]>(`${this.apiUrl}/devis/${devisId}`);
  }

  createLigne(data: LigneDevis): Observable<LigneDevis> {
    return this.http.post<LigneDevis>(this.apiUrl, data);
  }

  updateLigne(id: number, data: LigneDevis): Observable<LigneDevis> {
    return this.http.put<LigneDevis>(`${this.apiUrl}/${id}`, data);
  }

  deleteLigne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
