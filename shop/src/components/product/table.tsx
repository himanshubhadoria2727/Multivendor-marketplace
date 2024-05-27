import React from 'react';
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import { Product } from '@/types';
import AnchorLink from '../ui/links/anchor-link';
import Button from '../ui/button';
import router from 'next/router';



interface TableProps {
  nodes: Product[];
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  isLoading?: boolean;
  limit?: number;
}

export default function ProductTable({
  nodes,
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  isLoading,
  limit = 5,
}: TableProps) {
  const THEME = {
    Table: ``,
    Header: ``,
    Body: ``,
    BaseRow: `
        background-color: var(--theme-ui-colors-background);
    
        &.row-select-selected, &.row-select-single-selected {
          background-color: var(--theme-ui-colors-background-secondary);
          color: var(--theme-ui-colors-text);
        }
      `,
    HeaderRow: `
        border: 2px solid red;
        font-size: 15px;
        color: var(--theme-ui-colors-text-light);
    
        .th {
          border-bottom: 1px solid var(--theme-ui-colors-border);
        }
      `,
    Row: `
        font-size: 15px;
        color: var(--theme-ui-colors-text);
    
        &:not(:last-of-type) .td {
          border-bottom: 1px solid var(--theme-ui-colors-border);
        }
    
        &:hover {
          color: var(--theme-ui-colors-text-light);
        }
      `,
    BaseCell: `
        border-bottom: 1px solid transparent;
        border-right: 1px solid transparent;
    
        padding: 8px;
        height: 52px;
    
        svg {
          fill: var(--theme-ui-colors-text);
        }
      `,
    HeaderCell: ``,
    Cell: ``,
  };

  const data = { nodes };

  
  const handleNavigation = () => {
    router.push(`/products/product_page/${data?.slug}`); // Replace '/target-page' with your target route
  };
  console.log(data)
  const theme = useTheme(THEME);

  const sort = useSort(
    data,
    {},
    {
      sortFns: {
        DOMAIN_NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        DA: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        DR: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        TRAFFIC: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        SC: (array) =>
          array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
      },
    }
  );

  return (
    <div className='p-5 w-full h-full'>
      <Table data={data} theme={theme} layout={{ fixedHeader: true }} sort={sort}>
        {(tableList: any[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSort sortKey="DOMAIN_NAME">DOMAIN NAME</HeaderCellSort>
                <HeaderCellSort sortKey="DA">DA</HeaderCellSort>
                <HeaderCellSort sortKey="DR">DR</HeaderCellSort>
                <HeaderCellSort sortKey="TRAFFIC">TRAFFIC</HeaderCellSort>
                <HeaderCellSort sortKey="SC">SC</HeaderCellSort>
                <HeaderCellSort sortKey="SC">ACTION</HeaderCellSort>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item}>
                  <Cell className='text-base text-blue-500 hover:underline'><AnchorLink href={`https://${item.name}`} target='_blank'>{item.name}</AnchorLink></Cell>

                  <Cell><p className='p-2 flex w-fit text-white bg-green-400 rounded-lg'>{item.domain_authority}</p></Cell>
                  <Cell><p className='p-2 flex w-fit text-white bg-green-400 rounded-lg'>{item.domain_rating}</p></Cell>
                  <Cell><p className='p-2 flex w-fit text-white bg-green-400 rounded-lg'>{item.organic_traffic}</p></Cell>
                  <Cell><p className='p-2 flex w-fit text-white bg-green-400 rounded-lg'>{item.spam_score}</p>
                  </Cell>
                  <Cell>
                    <button className=" flex w-10 justify-center  rounded-lg bg-light-500 px-16 py-3 text-base font-semibold text-white text-brand bg-blue-900 dark:bg-white-600 dark:text-white  ">
                      Buy
                    </button>
                  </Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
};

