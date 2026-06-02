import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BonDeCommande } from '../models/bon-de-commande.model';

@Injectable({
  providedIn: 'root'
})
export class BonDeCommandeService {
  private apiUrl = `${environment.apiUrl}/bons-de-commande`;

  constructor(private http: HttpClient) {}

  getBonsDeCommande(): Observable<BonDeCommande[]> {
    return this.http.get<BonDeCommande[]>(`${this.apiUrl}?_=${Date.now()}`);
  }

  getBonDeCommande(id: number): Observable<BonDeCommande> {
    return this.http.get<BonDeCommande>(`${this.apiUrl}/${id}`);
  }

  createBonDeCommande(data: BonDeCommande): Observable<BonDeCommande> {
    return this.http.post<BonDeCommande>(this.apiUrl, data);
  }

  updateBonDeCommande(id: number, data: BonDeCommande): Observable<BonDeCommande> {
    return this.http.put<BonDeCommande>(`${this.apiUrl}/${id}`, data);
  }

  deleteBonDeCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  marquerLivree(id: number): Observable<BonDeCommande> {
    return this.http.post<BonDeCommande>(`${this.apiUrl}/${id}/livrer`, {});
  }
}
