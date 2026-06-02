export interface Fournisseur {
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
  created_at?: string;
  updated_at?: string;
}
