import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConversionService {
  private apiUrl = `${environment.apiUrl}/conversion`;

  constructor(private http: HttpClient) {}

  devisEnCommande(devisId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/devis-en-commande/${devisId}`, {});
  }

  commandeEnFacture(commandeId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/commande-en-facture/${commandeId}`, {});
  }

  commandeEnBonDeCommande(commandeId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/commande-en-bon-commande/${commandeId}`, data);
  }

  facturePaiement(factureId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/facture-paiement/${factureId}`, data);
  }

  marquerPayee(factureId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/marquer-payee/${factureId}`, {});
  }
}
