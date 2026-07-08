// Single source of truth for API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Optional: Helper for consistent fetch calls
export const apiFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const url = `${API_URL}${endpoint}`;
  return fetch(url, {
    credentials: 'include',
    ...options,
  });
};
