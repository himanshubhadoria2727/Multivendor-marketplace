import React, { useEffect, useMemo, useState } from 'react';
import {
  MRT_GlobalFilterTextField,
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Product } from '@/types';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import router from 'next/router';

interface TableProps {
  products: Product[];
}

const Example = ({ products }: TableProps) => {
  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Domain',
        enableSorting: false,
        size: 100,
        Cell: ({ renderedCellValue }) => (
          <>
          <a className=" font-sans tracking-wider hover:underline font-bold text-[1rem]" href={`https://${renderedCellValue}`} target="_blank">
            {renderedCellValue}
          </a>
          <br />
          <a href='#' className='text-[0.8rem] hover:text-brand transform hover:underline'>Add to campaign</a>
        </>
        ),
      },
      {
        accessorKey: 'domain_rating',
        header: 'DR',
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        size: 50,
        muiFilterSliderProps: {
          marks: true,
          max: 100, //custom max (as opposed to faceted max)
          min: 1, //custom min (as opposed to faceted min)
          step: 1,
        },
        Cell: ({ renderedCellValue }) => (
          <p>{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'domain_authority',
        header: 'DA',
        filterVariant: 'text',
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <p >{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'organic_traffic',
        header: 'Traffic',
        size: 100,
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        muiFilterSliderProps: {
          marks: true,
          max: 20_000, //custom max (as opposed to faceted max)
          min: 1000, //custom min (as opposed to faceted min)
          step: 1000,
        },
        Cell: ({ renderedCellValue }) => (
          <p >{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'spam_score',
        header: 'SC',
        size: 50,
        enableColumnFilter: false,
        // filterVariant: 'range-slider',
        // filterFn: 'betweenInclusive', // default (or between)
        // muiFilterSliderProps: {
        //   marks: true,
        //   max: 100, //custom max (as opposed to faceted max)
        //   min: 1, //custom min (as opposed to faceted min)
        //   step: 1,
        // },
        Cell: ({ renderedCellValue }) => (
          <p >{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'link_type',
        header: 'Links',
        size: 50,
        filterFn: 'equals',
        filterSelectOptions: ['Nofollow', 'Dofollow'],
        filterVariant: 'select',
        Cell: ({ renderedCellValue }) => (
          <p >{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'countries',
        header: 'Country',
        filterFn: 'equals',
        filterVariant: 'select',
        filterSelectOptions: ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czechia (Czech Republic)","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini (fmr. Swaziland)","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar (formerly Burma)","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia (formerly Macedonia)","Norway","Oman","Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"],
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <p >{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'price',
        header: 'GP',
        // filterVariant: 'range-slider',
        size: 50,
        filterFn: 'betweenInclusive', // default (or between)
        
        Cell: ({ row }) => (
          <button 
          className="flex justify-center w-[5rem] rounded-lg px-1 py-2 text-sm font-semibold hover:bg-brand/90 hover:text-white text-brand transition border-brand border dark:text-white"
          onClick={() => router.push(`/products/product_page/${row.original.slug}`)}>
            Buy $ { row.original.price }
          </button>

        ),
      },
      {
        accessorKey: 'isLinkInsertion',
        header: 'LI',
        // filterVariant: 'range-slider',
        size: 50,
        filterFn: 'betweenInclusive', // default (or between)
        muiFilterSliderProps: {
          marks: true,
          max: 50_000, //custom max (as opposed to faceted max)
          min: 50, //custom min (as opposed to faceted min)
          step: 50,
        },
        Cell: ({ row }) => (
          <button 
          className="flex justify-center w-[5rem] rounded-lg px-1 py-2 text-sm font-semibold hover:bg-brand/90 hover:text-white transition text-brand border-brand border dark:text-white"
          onClick={() => router.push(`/products/product_page/${row.original.slug}`)}>
            Buy $ { row.original.price }
          </button>

        ),
      },
      {
        header: 'Grey Niche',
        accessorKey:'is_niche',
        enableSorting: false,
        enableColumnFilter:false,
        size: 50,
        Cell: ({ row }) => (
          row.original.is_niche === "1" ? (
            <button
              className="flex justify-center w-[6rem] rounded-lg border-brand border transition duration-500 px-1 py-2 text-sm font-semibold text-brand"
              >
              Available
            </button>
          ) : (
            <button
              className="flex justify-center w-[6rem] rounded-lg border-brand border transition duration-500 px-1 py-2 text-sm font-semibold text-brand "
              >
              Not available
            </button>
             // or any other default value you want to display
          )
        ),
      }
      
    ],
[]
  );
console.log(products)
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10, // customize the default page size
});

useEffect(() => {
  // do something when the pagination state changes
}, [pagination.pageIndex, pagination.pageSize]);

const [alertShown, setAlertShown] = useState(false);

// Event listener for clicks on the document
const handleClick = (event: MouseEvent) => {
  let targetElement = event.target as HTMLElement; // Clicked element

  // Check if the clicked element or any of its ancestors have the class 'MuiPagination-ul'
  while (targetElement) {
    if (targetElement.classList && targetElement.classList.contains('MuiPagination-ul')) {
      // If alert hasn't been shown yet, show it
      if (!alertShown) {
        setAlertShown(true);
        alert('Subscribe to our monthly/yearly plan to see more pages');
      }
      return;
    }
    targetElement = targetElement.parentElement!;
  }
};

// Event listener to close the alert when the user clicks "OK"
const handleCloseAlert = () => {
  setAlertShown(false);
};

// Add event listeners when the component mounts
useEffect(() => {
  document.addEventListener('click', handleClick);
  return () => {
    document.removeEventListener('click', handleClick);
  };
}, []);

const table = useMaterialReactTable({
  columns,
  data: products, // use the products prop here
  // enableDensityToggle: false,
    muiPaginationProps: {
    color: 'primary',
    // shape: 'rounded',
    showRowsPerPage: false,
    variant: 'outlined',
  },
  paginationDisplayMode: 'pages',
  onPaginationChange: setPagination, // hoist pagination state to your state when it changes internally
  state: { pagination },
});

return (
    <MaterialReactTable
      table={table}
    />

);
};

export default Example;
