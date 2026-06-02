import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LigneCommande } from '../models/ligne-commande.model';

@Injectable({
  providedIn: 'root'
})
export class LigneCommandeService {
  private apiUrl = `${environment.apiUrl}/lignes-commandes`;

  constructor(private http: HttpClient) {}

  getLignesByCommande(commandeId: number): Observable<LigneCommande[]> {
    return this.http.get<LigneCommande[]>(`${this.apiUrl}/commande/${commandeId}`);
  }

  createLigne(data: LigneCommande): Observable<LigneCommande> {
    return this.http.post<LigneCommande>(this.apiUrl, data);
  }

  updateLigne(id: number, data: LigneCommande): Observable<LigneCommande> {
    return this.http.put<LigneCommande>(`${this.apiUrl}/${id}`, data);
  }

  deleteLigne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
