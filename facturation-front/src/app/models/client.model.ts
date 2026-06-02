export interface Client {
  id?: number;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  code_postal: string;
  pays: string;
  siret: string;
  notes: string;
  statut?: string;
  total_du?: number;
  stats?: { devis_count: number; commandes_count: number; factures_count: number; };
  devis?: any[];
  commandes?: any[];
  factures?: any[];
  created_at?: string;
  updated_at?: string;
}
