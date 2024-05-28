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
import { getTheme } from '@table-library/react-table-library/baseline';

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
    Table: `
      width: 100%;
      border-collapse: collapse;
    `,
    Header: `
      font-weight: bold;
      background-color: #f0f0f0;
      padding: 10px;
      text-align: center;
    `,
    Body: ``,
    BaseRow: `
      transition: background-color 0.3s ease;
      background-color: white;
      &:nth-child(even) {
        background-color: #f9f9f9;
      }
      &:hover {
        background-color: #f0f0f0;
      }
      text-align: center;
    `,
    HeaderRow: `
      border-bottom: 2px solid red;
    `,
    Row: `
      font-size: 15px;
      color: var(--theme-ui-colors-text);
      margin-bottom: 10px;
      text-align: center;
    `,
    BaseCell: `
      border: 1px solid #ddd;
      padding: 8px;
      text-align: center;
    `,
    HeaderCell: `
      padding: 12px;
      text-align: center;
    `,
    Cell: `
      padding: 8px;
      text-align: center;
    `,
  };
  
  const data = { nodes };

  const handleNavigation = () => {
    router.push(`/products/product_page/${data?.slug}`);
  };
  console.log(data)

  const sort = useSort(
    data,
    {},
    {
      sortFns: {
        DOMAIN: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        DA: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        DR: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        TRAFFIC: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        LINKS: (array) => array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
        SC: (array) =>
          array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
      },
    }
  );

  return (
    <div className="p-5 w-full h-full overflow-x-auto" style={{ overflowY: 'hidden' }}>
      <div style={{ minWidth: '800px', backgroundColor:"black"} }>
        <Table data={data} theme={THEME} layout={{ fixedHeader: true }} sort={sort}>
          {(tableList: any[]) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSort sortKey="DOMAIN">DOMAIN</HeaderCellSort>
                  <HeaderCellSort sortKey="DA">DA</HeaderCellSort>
                  <HeaderCellSort sortKey="DR">DR</HeaderCellSort>
                  <HeaderCellSort sortKey="TRAFFIC">TRAFFIC</HeaderCellSort>
                  <HeaderCellSort sortKey="SC">SC</HeaderCellSort>
                  <HeaderCellSort sortKey="LINKS">LINKS</HeaderCellSort>
                  <HeaderCell>ACTION</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map((item) => (
                  <Row key={item.id} item={item}>
                    <Cell className="text-base text-blue-500 hover:underline">
                      <AnchorLink href={`https://${item.name}`} target="_blank">{item.name}</AnchorLink>
                    </Cell>
                    <Cell className="bg-black">
                      <p className="px-3 py-[3px] flex w-fit p text-white text-sm bg-green-400 rounded-lg">{item.domain_authority}</p>
                    </Cell>
                    <Cell className="bg-black">
                      <p className="px-3 py-[3px] flex w-fit p text-white text-sm bg-green-400 rounded-lg">{item.domain_rating}</p>
                    </Cell>
                    <Cell className="bg-black">
                      <p className="px-3 py-[3px] flex w-fit p text-white text-sm bg-green-400 rounded-lg">{item.organic_traffic}</p>
                    </Cell>
                    <Cell className="bg-black">
                      <p className="px-3 py-[3px] flex w-fit p text-white text-sm bg-green-400 rounded-lg">{item.spam_score}</p>
                    </Cell>
                    <Cell className="bg-black">
                      <p className="px-3 py-[3px] flex w-fit p text-white text-sm bg-green-400 rounded-lg">{item.link_type}</p>
                    </Cell>
                    <Cell className="bg-black">
                      <button className="flex w-10 justify-center text-align rounded-lg bg-[#24b47e] px-8 py-3 mt-3 mb-3 text-xs font-semibold text-white text-brand dark:bg-white-600 dark:text-white">
                        Buy {item.price}
                      </button>
                    </Cell>
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </div>
    </div>
  );
};
