import { Client } from './client.model';
import { LigneCommande } from './ligne-commande.model';

export interface Commande {
  id?: number;
  numero_commande: string;
  client_id: number;
  date_commande: string;
  statut: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
  client?: Client;
  lignes?: LigneCommande[];
}
