import RCPagination, { PaginationProps } from 'rc-pagination';
import React, { ReactNode } from 'react';
import 'rc-pagination/assets/index.css'; // Keep this import for default styles
import { useTranslation } from 'next-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination: React.FC<PaginationProps> = (props) => {
  const { t } = useTranslation('common');

  const textItemRender = (
    current: ReactNode,
    type: string,
    element: ReactNode
  ) => {
    if (type === 'prev') {
      return <FaChevronLeft className="text-blue-500 hover:text-blue-700" title={t('text-prev')} />;
    }
    if (type === 'next') {
      return <FaChevronRight className="text-blue-500 hover:text-blue-700" title={t('text-next')} />;
    }
    return element;
  };

  return (
    <RCPagination
      itemRender={textItemRender}
      className="flex justify-center items-center my-4 px-3 py-1 mx-1 rounded-md transition-colors duration-300"
      prevIcon={<FaChevronLeft className="text-blue-500 hover:text-blue-700" />}
      nextIcon={<FaChevronRight className="text-blue-500 hover:text-blue-700" />}
      {...props}
    />
  );
};

export default Pagination;
