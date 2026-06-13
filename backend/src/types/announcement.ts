export interface Announcement {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Active' | 'Resolved';
  created_at: string;
}
