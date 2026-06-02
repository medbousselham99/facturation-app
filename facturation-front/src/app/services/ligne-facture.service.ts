import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LigneFacture } from '../models/ligne-facture.model';

@Injectable({
  providedIn: 'root'
})
export class LigneFactureService {
  private apiUrl = `${environment.apiUrl}/lignes-factures`;

  constructor(private http: HttpClient) {}

  getLignesByFacture(factureId: number): Observable<LigneFacture[]> {
    return this.http.get<LigneFacture[]>(`${this.apiUrl}/facture/${factureId}`);
  }

  createLigne(data: LigneFacture): Observable<LigneFacture> {
    return this.http.post<LigneFacture>(this.apiUrl, data);
  }

  updateLigne(id: number, data: LigneFacture): Observable<LigneFacture> {
    return this.http.put<LigneFacture>(`${this.apiUrl}/${id}`, data);
  }

  deleteLigne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
