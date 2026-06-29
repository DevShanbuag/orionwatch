/**
 * Error handling utilities
 * 
 * Centralized error handling for API calls and service layer operations.
 */

import type { ApiError } from '../types/common';

/**
 * Custom API error class
 */
export class ApiErrorClass extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Handle Supabase errors and convert to ApiError
 */
export const handleSupabaseError = (error: any): ApiErrorClass => {
  // Handle common Supabase error codes
  if (error.code === 'PGRST116') {
    return new ApiErrorClass('Resource not found', 404);
  }
  if (error.code === '23505') {
    return new ApiErrorClass('Duplicate entry', 409, error.details);
  }
  if (error.code === '23503') {
    return new ApiErrorClass('Foreign key constraint violation', 400);
  }
  if (error.code === '23514') {
    return new ApiErrorClass('Check constraint violation', 400);
  }
  if (error.code === '42501') {
    return new ApiErrorClass('Insufficient privileges', 403);
  }

  // Default error handling
  return new ApiErrorClass(
    error.message || 'An unexpected error occurred',
    error.statusCode || 500,
    error.details
  );
};

/**
 * Handle network errors
 */
export const handleNetworkError = (error: any): ApiErrorClass => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return new ApiErrorClass('Network error. Please check your connection.', 0);
  }
  
  return new ApiErrorClass(
    error.message || 'Network error occurred',
    0
  );
};

/**
 * Generic error handler that determines error type
 */
export const handleError = (error: any): ApiErrorClass => {
  // Check if it's already an ApiError
  if (error instanceof ApiErrorClass) {
    return error;
  }

  // Check for Supabase error
  if (error.code && error.code.startsWith('PGRST') || error.code.startsWith('23')) {
    return handleSupabaseError(error);
  }

  // Check for network error
  if (error.name === 'TypeError' || error.name === 'NetworkError') {
    return handleNetworkError(error);
  }

  // Default handling
  return new ApiErrorClass(
    error.message || 'An unexpected error occurred',
    error.statusCode || 500,
    error.details
  );
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: ApiError): string => {
  if (!error) return 'An unknown error occurred';

  switch (error.statusCode) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please log in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This resource already exists.';
    case 500:
      return 'Server error. Please try again later.';
    case 0:
      return 'Network error. Please check your connection.';
    default:
      return error.message || 'An error occurred';
  }
};