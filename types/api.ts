/**
 * Base response types for all API calls
 * This ensures TypeScript knows the structure of responses from your API
 */

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  [key: string]: any;
}

export interface ApiError {
  message: string;
  code?: string;
}
