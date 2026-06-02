export interface Produit {
  id?: number;
  nom: string;
  description?: string;
  prix_unitaire_ht: number;
  tva_taux: number;
  unite: string;
  reference?: string;
  actif: boolean;
  created_at?: string;
  updated_at?: string;
}
