/**
 * Common types used across the application
 */

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type Status = 'Active' | 'Inactive' | 'Pending' | 'Resolved' | 'Closed';

export type PaginationParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type DateRange = {
  start: string;
  end: string;
};

export type ApiError = {
  message: string;
  statusCode?: number;
  details?: any;
};

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
};