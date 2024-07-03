import { Product, ProductQueryOptions } from '@/types';
import { useQuery } from 'react-query';
import { API_ENDPOINTS } from './client/api-endpoints';
import { dashboardClient } from '@/data/client/dashboard';
export function useAnalyticsQuery() {
  return useQuery([API_ENDPOINTS.ANALYTICS], dashboardClient.analytics);
}

