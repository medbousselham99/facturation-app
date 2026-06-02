export interface Parametre {
  id?: number;
  nom_entreprise: string;
  logo?: string;
  adresse?: string;
  ville?: string;
  code_postal?: string;
  pays?: string;
  siret?: string;
  ice?: string;
  email?: string;
  telephone?: string;
  rib?: string;
  tva_taux_default: number;
  delai_paiement_jours: number;
  email_expediteur?: string;
  email_objet_devis?: string;
  email_objet_facture?: string;
  email_corps_devis?: string;
  email_corps_facture?: string;
  created_at?: string;
  updated_at?: string;
}
