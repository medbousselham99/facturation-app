import { Client } from './client.model';
import { LigneAvoir } from './ligne-avoir.model';

export interface Avoir {
  id?: number;
  numero_avoir: string;
  facture_id: number;
  client_id: number;
  date_avoir: string;
  motif?: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  statut: string;
  created_at?: string;
  updated_at?: string;
  client?: Client;
  lignes?: LigneAvoir[];
}
