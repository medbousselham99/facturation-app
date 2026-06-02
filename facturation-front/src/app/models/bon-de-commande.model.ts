import { Fournisseur } from './fournisseur.model';
import { LigneBonDeCommande } from './ligne-bon-de-commande.model';
import { Commande } from './commande.model';

export interface BonDeCommande {
  id?: number;
  numero_bc: string;
  fournisseur_id: number;
  commande_id?: number;
  date_bc: string;
  date_livraison_prevue: string;
  statut: string;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  notes: string;
  created_at?: string;
  updated_at?: string;
  fournisseur?: Fournisseur;
  commande?: Commande;
  lignes?: LigneBonDeCommande[];
}
