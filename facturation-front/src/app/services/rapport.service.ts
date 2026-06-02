import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RapportVentes {
  total_ventes: number;
  nombre_factures: number;
}

export interface RapportTVA {
  total_tva_collectee: number;
}

export interface TopClient {
  client_id: number;
  client_nom: string;
  total_ht: number;
  total_ttc: number;
  nombre_factures: number;
}

@Injectable({ providedIn: 'root' })
export class RapportService {
  private apiUrl = `${environment.apiUrl}/rapports`;

  constructor(private http: HttpClient) {}

  getVentes(dateDebut?: string, dateFin?: string): Observable<RapportVentes> {
    const params: any = {};
    if (dateDebut) params.date_debut = dateDebut;
    if (dateFin) params.date_fin = dateFin;
    return this.http.get<RapportVentes>(`${this.apiUrl}/ventes`, { params });
  }

  getTVA(dateDebut?: string, dateFin?: string): Observable<RapportTVA> {
    const params: any = {};
    if (dateDebut) params.date_debut = dateDebut;
    if (dateFin) params.date_fin = dateFin;
    return this.http.get<RapportTVA>(`${this.apiUrl}/tva`, { params });
  }

  getTopClients(dateDebut?: string, dateFin?: string): Observable<TopClient[]> {
    const params: any = {};
    if (dateDebut) params.date_debut = dateDebut;
    if (dateFin) params.date_fin = dateFin;
    return this.http.get<TopClient[]>(`${this.apiUrl}/top-clients`, { params });
  }
}
