export interface LigneFacture {
  id?: number;
  facture_id?: number;
  description: string;
  quantite: number;
  prix_unitaire_ht: number;
  montant_ht?: number;
}
