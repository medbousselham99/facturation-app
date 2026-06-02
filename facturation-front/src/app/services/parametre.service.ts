import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CompanySettings {
  nom_entreprise: string;
  logo?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  siret?: string;
  ice?: string;
  email?: string;
  telephone?: string;
  rib?: string;
  tva_taux_defaut: number;
  delai_paiement_jours: number;
  email_expediteur?: string;
  objet_devis?: string;
  objet_facture?: string;
  corps_devis?: string;
  corps_facture?: string;
}

@Injectable({ providedIn: 'root' })
export class ParametreService {
  private apiUrl = `${environment.apiUrl}/parametres`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<CompanySettings> {
    return this.http.get<CompanySettings>(this.apiUrl);
  }

  saveSettings(data: CompanySettings): Observable<CompanySettings> {
    return this.http.put<CompanySettings>(this.apiUrl, data);
  }
}
