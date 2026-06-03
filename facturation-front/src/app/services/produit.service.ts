import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Produit } from '../models/produit.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<PaginatedResponse<Produit>>(this.apiUrl).pipe(map(r => r.data));
  }

  getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  createProduit(data: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, data);
  }

  updateProduit(id: number, data: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
