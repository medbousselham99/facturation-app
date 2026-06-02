export interface Paiement {
  id?: number;
  facture_id: number;
  montant: number;
  date_paiement: string;
  mode_paiement: string;
  reference?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  facture?: any;
}
