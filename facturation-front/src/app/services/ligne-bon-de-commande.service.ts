import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LigneBonDeCommande } from '../models/ligne-bon-de-commande.model';

@Injectable({
  providedIn: 'root'
})
export class LigneBonDeCommandeService {
  private apiUrl = `${environment.apiUrl}/lignes-bons-de-commande`;

  constructor(private http: HttpClient) {}

  getLignesByBonDeCommande(bonCommandeId: number): Observable<LigneBonDeCommande[]> {
    return this.http.get<LigneBonDeCommande[]>(`${this.apiUrl}/bon-commande/${bonCommandeId}`);
  }

  createLigne(data: LigneBonDeCommande): Observable<LigneBonDeCommande> {
    return this.http.post<LigneBonDeCommande>(this.apiUrl, data);
  }

  updateLigne(id: number, data: LigneBonDeCommande): Observable<LigneBonDeCommande> {
    return this.http.put<LigneBonDeCommande>(`${this.apiUrl}/${id}`, data);
  }

  deleteLigne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
