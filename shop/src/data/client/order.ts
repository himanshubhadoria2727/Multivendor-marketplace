import {
    Order,
    CreateOrderInput,
    OrderQueryOptions,
    OrderPaginator,
    QueryOptions,
    
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { HttpClient } from './http-client';
import { crudFactory } from './curd-factory';
  
  export const orderClient = {
    ...crudFactory<Order, QueryOptions, CreateOrderInput>(API_ENDPOINTS.ORDERS),
    get: ({ id, language }: { id: string; language: string }) => {
      return HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, {
        language,
      });
    },
    // paginated: ({ tracking_number, ...params }: Partial<OrderQueryOptions>) => {
    //   return HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
    //     searchJoin: 'and',
    //     ...params,
    //     search: HttpClient.formatSearchParams({ tracking_number }),
    //   });
    // },
    
    orderSeen({ id }: { id: string }) {
      return HttpClient.post<any>(`${API_ENDPOINTS.ORDER_SEEN}/${id}`, id);
    },
  };


  