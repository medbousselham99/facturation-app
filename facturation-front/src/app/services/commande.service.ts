import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Commande } from '../models/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = `${environment.apiUrl}/commandes`;

  constructor(private http: HttpClient) {}

  getCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getCommande(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  createCommande(data: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, data);
  }

  updateCommande(id: number, data: Commande): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/${id}`, data);
  }

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  marquerLivree(id: number): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/${id}/livrer`, {});
  }
}
