import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Devis } from '../models/devis.model';

@Injectable({
  providedIn: 'root'
})
export class DevisService {
  private apiUrl = `${environment.apiUrl}/devis`;

  constructor(private http: HttpClient) {}

  getDevis(): Observable<Devis[]>;
  getDevis(id: number): Observable<Devis>;
  getDevis(id?: number): Observable<Devis[] | Devis> {
    if (id) {
      return this.http.get<Devis>(`${this.apiUrl}/${id}`);
    }
    return this.http.get<Devis[]>(this.apiUrl);
  }

  createDevis(data: Devis): Observable<Devis> {
    return this.http.post<Devis>(this.apiUrl, data);
  }

  updateDevis(id: number, data: Devis): Observable<Devis> {
    return this.http.put<Devis>(`${this.apiUrl}/${id}`, data);
  }

  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  marquerEnvoye(id: number): Observable<Devis> {
    return this.http.post<Devis>(`${this.apiUrl}/${id}/envoyer`, {});
  }
}
