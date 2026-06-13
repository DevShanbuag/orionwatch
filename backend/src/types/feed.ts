export interface Feed {
  id: string;
  name: string;
  url?: string;
  source_type: string;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
}
