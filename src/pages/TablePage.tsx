import React, {useState, useMemo, useEffect} from 'react'
import '../style/table.css';
import {
  Column,
  Table,
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  ColumnDef,
  flexRender,
  FilterFns,
} from '@tanstack/react-table'

// import { RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'
import { makeData, Person } from '../data/makeData';

// declare module '@tanstack/table-core' {
//   interface FilterFns {
//     fuzzy: FilterFn<unknown>
//   }
//   interface FilterMeta {
//     itemRank: RankingInfo
//   }
// }

// const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
//   // Rank the item
//   const itemRank = rankItem(row.getValue(columnId), value)

//   // Store the itemRank info
//   addMeta({ itemRank, })

//   // Return if the item should be filtered in/out
//   return itemRank.passed
// }

// const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
//   let dir = 0

//   // Only sort by rank if the column has ranking information
//   if (rowA.columnFiltersMeta[columnId]) {
//     dir = compareItems(
//       rowA.columnFiltersMeta[columnId]?.itemRank!,
//       rowB.columnFiltersMeta[columnId]?.itemRank!
//     )
//   }
//   // Provide an alphanumeric fallback for when the item ranks are equal
//   return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
// }

const TablePage = () => {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<Person[]>(() => makeData(1000));
  
  const refreshData = () => setData(old => makeData(1000));
  const resetTable = () => {
    table.resetPagination();
    table.resetColumnFilters();
    table.resetGlobalFilter();
    table.resetRowSelection();
    table.resetSorting();
  }

  const columns = useMemo<ColumnDef<Person, any>[]>(
    () => [
      // {
      //   header: 'Name',
      //   footer: props => props.column.id,
      //   columns: [
          {
            accessorKey: 'firstName',
            cell: info => info.getValue(),
            header: () => <span>First Name</span>,
            footer: props => props.column.id,
          },
          {
            accessorFn: row => row.lastName,
            id: 'lastName',
            cell: info => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'firstName',
            cell: info => info.getValue(),
            header: () => <span>First Name</span>,
            footer: props => props.column.id,
          },
          {
            accessorFn: row => row.lastName,
            id: 'lastName',
            cell: info => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'firstName',
            cell: info => info.getValue(),
            header: () => <span>First Name</span>,
            footer: props => props.column.id,
          },
          {
            accessorFn: row => row.lastName,
            id: 'lastName',
            cell: info => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: props => props.column.id,
          },
          {
            accessorKey: 'firstName',
            cell: info => info.getValue(),
            header: () => <span>First Name</span>,
            footer: props => props.column.id,
          },
          {
            accessorFn: row => row.lastName,
            id: 'lastName1',
            cell: info => info.getValue(),
            header: () => <span>Last Name Pinned</span>,
            footer: props => props.column.id,
          },
          {
            accessorFn: row => `${row.firstName} ${row.lastName}`,
            id: 'fullName',
            header: 'Full Name',
            cell: info => info.getValue(),
            footer: props => props.column.id,
            // filterFn: 'fuzzy',
            // sortingFn: fuzzySort,
          },
      //   ],
      // },
      // {
      //   header: 'Info',
      //   footer: props => props.column.id,
      //   columns: [
      //     {
      //       accessorKey: 'age',
      //       header: () => 'Age',
      //       footer: props => props.column.id,
      //     },
      //     {
      //       header: 'More Info',
      //       columns: [
      //         {
      //           accessorKey: 'visits',
      //           header: () => <span>Visits</span>,
      //           footer: props => props.column.id,
      //         },
      //         {
      //           accessorKey: 'status',
      //           header: 'Status',
      //           footer: props => props.column.id,
      //         },
      //         {
      //           accessorKey: 'progress',
      //           header: 'Profile Progress',
      //           footer: props => props.column.id,
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      // fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      columnPinning: { right: ['lastName1'] }
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    // globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  return (
    <div className="row p-2 mt-3">
      <div className='col g-0 text-start mb-2'>
        <DebouncedInput
          value= {globalFilter ?? ''}
          onChange= {value => setGlobalFilter(String(value))}
          className="p-2 font-lg border border-block"
          placeholder="Search all Columns..."
        />
      </div>
      <div className='g-0 mb-2 scrollable'>
        <table> 
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th 
                      key={header.id} colSpan={header.colSpan}
                      className = {header.column.id === 'lastName1'? 'sticky-Col':''}
                      >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none': '',
                                onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td 
                        key={cell.id}
                        className = {cell.column.id === 'lastName1'? 'sticky-Col':''}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="g-0 d-flex align-items-center gap-2 mb-3">
        <div>
          Showing 
          <strong>
          {' '} {(table.getState().pagination.pageSize * table.getState().pagination.pageIndex) + 1} 
          {' '} to {' '}
            {(table.getState().pagination.pageSize * table.getState().pagination.pageIndex) + table.getState().pagination.pageSize}
          </strong>  
          {' '} of {' '}
          <strong>
            {table.getPrePaginationRowModel().rows.length}
          </strong>
          {' '} entries
        </div>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="d-flex align-items-center gap-1">
          Page 
          <strong>
            {' '}{table.getState().pagination.pageIndex + 1} of {' '} {table.getPageCount()}
          </strong>
        </span>
        <span className="d-flex align-items-center gap-1">
          | Go to page:
          <input
            type="number"
            // defaultValue={table.getState().pagination.pageIndex + 1}
            value={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page);
            }}
            className="border p-1 rounded"
          />
        </span>
        <select
          className="border p-1 rounded"
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}>
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          className='mx-1 p-2 border-1 rounded' 
          onClick={() => resetTable()}>
            Reset
        </button>
        <button
          className='mx-1 p-2 border-1 rounded'  
          onClick={() => refreshData()}>
            Refresh Data
        </button>
      </div>
      {/* <pre>{JSON.stringify(table.getState(), null, 2)}</pre> */}
    </div>
  )
}
function Filter({ column, table, }: 
  {
    column: Column<any, unknown>
    table: Table<any>
  }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="px-1 mx-1 border rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="px-1 mx-1 border rounded"
        />
      </div>
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="px-1 border rounded"
        list={column.id + 'list'}
      />
    </>
  )
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}
export default TablePage;