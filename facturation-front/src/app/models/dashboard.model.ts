export interface DashboardData {
  chiffre_affaires_mois: number;
  factures_payees: { montant: number; nombre: number };
  factures_en_attente: { montant: number; nombre: number };
  factures_en_retard: { montant: number; nombre: number };
  devis_en_cours: { nombre: number; taux_conversion: string };
  nouveaux_clients_mois: number;
  ca_mensuel: { mois: string; annee: string; total: number }[];
  statuts_factures: Record<string, { count: number; total: number }>;
  evolution_devis_factures: { mois_annee: string; devis_count: number; facture_count: number }[];
  activite_recente: { id: number; type: string; numero: string; client: string; montant: number; statut: string; created_at: string }[];
  alertes: {
    factures_en_retard: any[];
    devis_expires: any[];
    bons_commande_non_traites: any[];
  };
}
