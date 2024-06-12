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
        size: 250,
        Cell: ({ renderedCellValue }) => (
          <a className="text-blue-600 font-sans tracking-wider hover:underline font-bold text-[1rem]" href={`https://${renderedCellValue}`} target="_blank">
            {renderedCellValue}
          </a>

        ),
      },
      {
        accessorKey: 'domain_authority',
        header: 'DA',
        filterVariant: 'text',
        size: 50,
        Cell: ({ renderedCellValue }) => (
          <p className="px-8 py-1 w-fit text-sm rounded-lg text-green-700 bg-green-200">{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'domain_rating',
        header: 'DR',
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        size: 100,
        muiFilterSliderProps: {
          marks: true,
          max: 100, //custom max (as opposed to faceted max)
          min: 1, //custom min (as opposed to faceted min)
          step: 1,
        },
        Cell: ({ renderedCellValue }) => (
          <p className="px-8 py-1 w-fit text-sm rounded-lg text-green-700 bg-green-200">{renderedCellValue}</p>
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
          max: 200_000, //custom max (as opposed to faceted max)
          min: 1000, //custom min (as opposed to faceted min)
          step: 1000,
        },
        Cell: ({ renderedCellValue }) => (
          <p className="px-8 py-1 w-fit text-sm rounded-lg text-blue-700 bg-blue-200">{renderedCellValue}</p>
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
          <p className="px-6 py-1 w-fit text-sm rounded-lg text-purple-700 bg-purple-200">{renderedCellValue}</p>
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
          <p className="px-4 py-1 w-fit text-sm rounded-lg border-red-900 text-green-700 bg-green-200">{renderedCellValue}</p>
        ),
      },
      {
        accessorKey: 'price',
        header: 'GP/Li',
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
          className="flex justify-center w-[7rem] rounded-lg px-1 py-2 text-sm font-semibold text-white bg-brand/90 dark:bg-white-600 dark:text-white"
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
              className="flex justify-center w-[7rem] rounded-lg border-brand border transition duration-500	 hover:bg-brand hover:text-white px-1 py-2 text-sm font-semibold text-brand broder"
              onClick={() => router.push(`/products/product_page/${row.original.slug}`)}>
              Buy now
            </button>
          ) : (
            <button
              className="flex justify-center w-[7rem] rounded-lg border-brand border transition duration-500 px-1 py-2 text-sm font-semibold text-brand broder "
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
  pageSize: 6, // customize the default page size
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
    shape: 'rounded',
    showRowsPerPage: false,
    variant: 'outlined',
  },
  paginationDisplayMode: 'pages',
  columnFilterDisplayMode: 'popover',
  onPaginationChange: setPagination, // hoist pagination state to your state when it changes internally
  state: { pagination },
});

const globalTheme = useTheme(); //(optional) if you already have a theme defined in your app root, you can import here

const tableTheme = useMemo(
  () =>
    createTheme({
      palette: {
        mode: globalTheme.palette.mode, //let's use the same dark/light mode as the global theme
        primary: globalTheme.palette.secondary, //swap in the secondary color as the primary for the table
        info: {
          main: 'rgb(255,122,0)', //add in a custom color for the toolbar alert background stuff
        },
        background: {
          default:
            globalTheme.palette.mode === 'light'
              ? 'light' //random light yellow color for the background in light mode
              : 'dark', //pure black table in dark mode for fun
        },
      },
      typography: {
        button: {
          textTransform: 'none', //customize typography styles for all buttons in table by default
          fontSize: '1.2rem',
        },
      },
      components: {
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              fontSize: '1.1rem', //override to make tooltip font size larger
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            thumb: {
              color: 'pink', //change the color of the switch thumb in the columns show/hide menu to pink
            },
          },
        },
      },
    }),
  [globalTheme],
);
return (
  <ThemeProvider theme={tableTheme}>
    <MaterialReactTable
      table={table}
    />
  </ThemeProvider>
);
};

export default Example;
