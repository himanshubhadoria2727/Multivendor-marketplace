import {
  Order,
  CreateOrderInput,
  OrderQueryOptions,
  OrderPaginator,
  QueryOptions,
  InvoiceTranslatedText,
  GenerateInvoiceDownloadUrlInput,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const orderClient = {
  ...crudFactory<Order, QueryOptions, CreateOrderInput>(API_ENDPOINTS.ORDERS),
  get: ({ id, language }: { id: string; language: string }) => {
    return HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, {
      language,
    });
  },
  orderStatusCount() {
    return HttpClient.get<any>(API_ENDPOINTS.ORDERS_STATUS_COUNT);
  },
  paginated: ({
    tracking_number,
    order_status,
    ...params
  }: Partial<OrderQueryOptions>) => {
    return HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ tracking_number, order_status }),
    });
  },
  downloadInvoice: (input: GenerateInvoiceDownloadUrlInput) => {
    return HttpClient.post<string>(
      `${API_ENDPOINTS.ORDER_INVOICE_DOWNLOAD}`,
      input,
    );
  },
  orderSeen({ id }: { id: string }) {
    return HttpClient.post<any>(`${API_ENDPOINTS.ORDER_SEEN}/${id}`, id);
  },
};
