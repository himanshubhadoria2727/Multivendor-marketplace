import { Table } from '@/components/ui/table';
import Pagination from '@/components/ui/pagination';
import { useTranslation } from 'next-i18next';
import dayjs from 'dayjs';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useMemo } from 'react';
import { Order, Withdraw } from '@/types';
import Badge from '../ui/badge/badge';
import StatusColor from '../order/status-color';

type UnifiedTransaction = {
  id: string;
  type: 'withdraw' | 'order';
  amount: number;
  selectedForm: string;
  status: string;
  payment_method:string;  
  order_status: string;
  created_at: string;
};

type Props = {
  withdraws: Withdraw[];
  orders: Order[];
  paginatorInfo: {
    total: number;
    currentPage: number;
    perPage: number;
  };
  onPagination: (page: number) => void;
};

const UnifiedTransactionList = ({
  withdraws,
  orders,
  paginatorInfo,
  onPagination,
}: Props) => {
  const { t } = useTranslation();

  // Combine transactions and sort by date
  const combinedTransactions = [...withdraws, ...orders].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  console.log('combinedTransactions', combinedTransactions);

  // Define columns for the table
  const columns = [
    //   {
    //     title: t('Type'),
    //     dataIndex: 'type',
    //     key: 'type',
    //     align: 'center',
    //     width:150,
    //     render: (type: string, id:number, selectedForm:string, item:any) => (
    //       <span>{type === 'withdraw' ? t('Withdraw') : item?.products[0]?.pivot?.selectedForm}</span>
    //     ),
    //   },
    {
      title: t('Type'),
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 150,
      render: (type: string, record: UnifiedTransaction) => (
        <span>
          {type === 'withdraw'
            ? t(`#${record.id} Withdraw`)
            : record?.selectedForm
            ? record.selectedForm === 'guest_post'
              ? `#${record.id} Guest Post`
              : `#${record.id} Link Insertion`
            : 'Order'}
        </span>
      ),
    },
    {
      title: t('Credit'),
      dataIndex: 'amount',
      key: 'credit',
      align: 'center',
      width: 150,
      render: (amount: number, record: UnifiedTransaction) => (
        <span className="text-green-600">
          {record.type === 'order' ? amount.toFixed(2) : '-'}
        </span>
      ),
    },
    {
      title: t('Debit'),
      dataIndex: 'amount',
      key: 'debit',
      align: 'center',
      width: 150,
      render: (amount: number, record: UnifiedTransaction) => (
        <span className="text-red-600">
          {record.type === 'withdraw' ? amount.toFixed(2) : '-'}
        </span>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 150,
      render: (status: string, record: UnifiedTransaction) => (
        <span className="text-ed-600">
           <Badge text={record.type === 'withdraw' ? status: record.status}color={StatusColor(record.status)} />
        </span>
      ),    
    },
    {
      title: t('Payment method'),
      dataIndex: 'payment_method',
      key: 'payment_method',
      align: 'center',
      width: 150,
      render: (payment_method: string, record: UnifiedTransaction) => (
        <span className="text-ed-600">
           <Badge text={record.type === 'withdraw' ? payment_method: record.payment_method}color={StatusColor(record.payment_method)} />
        </span>
      ),    
    },
    {
      title: t('Date'),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: 150,
      render: (created_at: string) => dayjs(created_at).format('MMM D, YYYY'),
    },
  ];

  return (
    <div className="mb-8 overflow-hidden rounded shadow">
      <Table
        columns={columns}
        data={combinedTransactions}
        rowKey="id"
        scroll={{ x: 900 }}
        emptyText={() => (
          <div className="flex flex-col items-center py-7">
            <NoDataFound className="w-52" />
            <div className="mb-1 pt-6 text-base font-semibold text-heading">
              {t('table:empty-table-data')}
            </div>
            <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
          </div>
        )}
      />
      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </div>
  );
};

export default UnifiedTransactionList;
