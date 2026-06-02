import { Client } from './client.model';
import { LigneDevis } from './ligne-devis.model';

export interface Devis {
  id?: number;
  numero_devis: string;
  client_id: number;
  date_devis: string;
  date_validite: string;
  statut: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
  client?: Client;
  lignes?: LigneDevis[];
}
