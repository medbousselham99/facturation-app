export interface LigneDevis {
  id?: number;
  devis_id?: number;
  description: string;
  quantite: number;
  prix_unitaire_ht: number;
  montant_ht?: number;
}
