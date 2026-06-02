import { Client } from './client.model';
import { Commande } from './commande.model';
import { Devis } from './devis.model';
import { LigneFacture } from './ligne-facture.model';

export interface Facture {
  id?: number;
  numero_facture: string;
  client_id: number;
  commande_id?: number;
  devis_id?: number;
  date_facture: string;
  date_echeance: string;
  statut: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  montant_paye?: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
  client?: Client;
  commande?: Commande;
  devis?: Devis;
  lignes?: LigneFacture[];
}
