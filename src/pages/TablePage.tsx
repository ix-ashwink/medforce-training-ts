import React, {useState, useMemo, useEffect, FC} from 'react'
import '../style/table.css';
import {
  Column,
  Table,
  Header,
  useReactTable,
  ColumnFiltersState,
  ColumnOrderState,
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
  RowData,
} from '@tanstack/react-table'

// import { RankingInfo, rankItem, compareItems, } from '@tanstack/match-sorter-utils'
import { makeData, Person } from '../data/makeData';
import exportExcel from '../services/excelExport';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

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

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<Person>> = {
  cell: function Cell ({ getValue, row: { index }, column: { id }, table }) {
    
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value)
    }

    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return (
      <input
        value={value as string}
        onChange={e => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  }
}

const reorderColumn = ( draggedColumnId: string, targetColumnId: string, columnOrder: string[] ): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder]
}

const DraggableColumnHeader: FC<{ header: Header<Person, unknown>, table: Table<Person> }> = ({ header, table }) => {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<Person>) => {
      const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
      setColumnOrder(newColumnOrder);
    },
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  })

  return (
    <th
      ref={dropRef}
      colSpan={header.colSpan}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div ref={previewRef}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <button ref={dragRef}>🟰</button>
      </div>
    </th>
  )
}
 
const TablePage = () => {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState<Person[]>(() => makeData(1000));
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [editableRowIndex, setEditableRowIndex] = useState<number>(-1);
  
  const refreshData = () => setData(old => makeData(1000));
  const resetTable = () => {
    table.resetPagination();
    table.resetColumnFilters();
    table.resetGlobalFilter();
    table.resetRowSelection();
    table.resetSorting();
    table.resetColumnVisibility();
    resetOrder();
  }
  
  const handleEditClick = (rowIndex: number) => {
    setEditableRowIndex(rowIndex);
  }

  const exportCSV = () => {
    exportExcel(table, 'data', true);
  }

  const resetOrder = () =>
    setColumnOrder(columns.map(column => column.id as string))

  const columns = useMemo<ColumnDef<Person, any>[]>( () => 
    [
      {
        accessorKey: 'firstName',
        enableHiding: false,
        cell: info => info.getValue(),
        header: 'First Name',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'lastName',
        id: 'lastName',
        cell: info => info.getValue(),
        header: 'Last Name',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: false,
        header: 'Actions',
        footer: props => props.column.id,
        cell: ({ cell }) => (
          <div className='d-flex justify-content-center'>
            <button 
              className='btn btn-warning m-1'
              onClick={() => handleEditClick(cell.row.index)}
            >
              Edit
            </button>
            <button 
              className='btn btn-danger m-1'
              // onClick={}
            >
              Delete
            </button>
          </div>
        ),
      },
      {
        accessorFn: row => `${row.firstName} ${row.lastName}`,
        id: 'fullName',
        header: 'Full Name',
        enableHiding: false,
        cell: info => info.getValue(),
        footer: props => props.column.id,
        // filterFn: 'fuzzy',
        // sortingFn: fuzzySort,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        // cell: (info) => (editableRowIndex===info.cell.row.index? info.getValue(): null),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'visits',
        header: 'Visits',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
    ],
    []
  )
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map(column => column.id as string) //must start out with populated columnOrder so we can splice
  )

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    filterFns: {
      // fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      columnPinning: { right: ['actions'] },
      columnVisibility,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnVisibilityChange: setColumnVisibility,
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
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              }
            }
            return row;
          })
        )
      },
    },
    debugTable: false,
    debugHeaders: false,
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
      <div className='col d-flex g-0 text-start mb-2'>
        <DebouncedInput
          value= {globalFilter ?? ''}
          onChange= {value => setGlobalFilter(String(value))}
          className="p-2 font-lg border border-block"
          placeholder="Search all Columns..."
        />
        <div className="dropdown mx-2">
          <button 
            className="btn btn-secondary dropdown-toggle p-2" type="button" id="columnvisibilitydropdown" 
            data-bs-auto-close="outside" data-bs-toggle="dropdown" aria-expanded="false"
          >
            Visible Columns
          </button>
          <ul className="dropdown-menu" aria-labelledby="columnvisibilitydropdown">
            <li onClick={(e) => e.stopPropagation()}>
            {table.getAllLeafColumns().map(column => {
              return (
                <div key={column.id} className="px-1">
                {
                  column.columnDef.enableHiding !== false &&
                  <label>
                    <input
                      {...{
                        type: 'checkbox',
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{' '}
                    {column.columnDef.header?.toString()}
                  </label>
                }
                </div>
              )
            })}
            </li>
          </ul>
        </div>
      </div>
      <div className='col g-0 text-end mb-2'>
        <button 
          className='btn btn-primary'
          onClick={exportCSV}
        >
          Export
        </button>
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
                      className = {header.column.id === 'actions'? 'sticky-Col':''}
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
                        className = {cell.column.id === 'actions'? 'sticky-Col':''}
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
      <div className="d-flex space-x-2 m-1">
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
        className="px-2 border rounded"
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