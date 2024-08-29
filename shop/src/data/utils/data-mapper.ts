import { MappedPaginatorInfo,PaginatorInfo } from '@/types';
import camelCaseKeys from 'camelcase-keys';

// interface Paginator {
//   current_page: number;
//   first_page_url: string;
//   from: number;
//   last_page: number;
//   last_page_url: string;
//   links: any[];
//   next_page_url: string | null;
//   path: string;
//   per_page: number;
//   prev_page_url: string | null;
//   to: number;
//   total: number;
//   data?: any[];
// }

export const mapPaginatorData = (
  obj: PaginatorInfo<any> | undefined,
): MappedPaginatorInfo | null => {
  if (!obj) return null;
  const {
    //@ts-ignore
    data,
    ...formattedValues
  } = camelCaseKeys(
    //@ts-ignore
    obj,
  );
  //@ts-ignore
  return {
    ...formattedValues,
    hasMorePages:
      //@ts-ignore
      formattedValues.lastPage !== formattedValues.currentPage,
  };
};