export interface LigneBonDeCommande {
  id?: number;
  bon_commande_id?: number;
  description: string;
  quantite: number;
  prix_unitaire_ht: number;
  montant_ht?: number;
}
