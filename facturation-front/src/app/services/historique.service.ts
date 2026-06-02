import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Historique } from '../models/historique.model';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {
  private apiUrl = `${environment.apiUrl}/historiques`;

  constructor(private http: HttpClient) {}

  getByDocument(documentType: string, documentId: number): Observable<Historique[]> {
    return this.http.get<Historique[]>(`${this.apiUrl}?document_type=${documentType}&document_id=${documentId}`);
  }
}
