export interface LigneAvoir {
  id?: number;
  avoir_id?: number;
  description: string;
  quantite: number;
  prix_unitaire_ht: number;
  montant_ht?: number;
}
