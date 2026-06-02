export interface Historique {
  id: number;
  document_type: string;
  document_id: number;
  action: string;
  description?: string;
  user_id?: number;
  metadata?: any;
  created_at: string;
  updated_at?: string;
}
