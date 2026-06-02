export interface RapportVentes {
  total_ventes: number;
  nombre_factures: number;
  periode: { debut: string; fin: string };
}

export interface RapportTVA {
  total_tva_collectee: number;
  periode: { debut: string; fin: string };
}

export interface TopClient {
  client_id: number;
  client_nom: string;
  total_ht: number;
  total_ttc: number;
  nombre_factures: number;
}
