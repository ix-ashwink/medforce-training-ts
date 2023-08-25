import React, {useState, useMemo, useEffect, FC} from 'react'
import '../style/table.css';
import {
  useReactTable,
  ColumnFiltersState,
  ColumnOrderState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  RowData,
} from '@tanstack/react-table'

import { makeData, Person } from '../data/makeData';
import exportExcel from '../services/excelExport';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableColumnHeader from '../components/TableColumnHeader';
import DebouncedInput from '../components/DebouncedInput';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

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

  const resetOrder = () => setColumnOrder(columns.map(column => column.id as string));

  const columns = useMemo<ColumnDef<Person, any>[]>( () => 
    [
      {
        accessorKey: 'firstName',
        id: 'firstName',
        enableHiding: false,
        cell: info => info.getValue(),
        header: 'First Name',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'lastName',
        id: 'lastName',
        enableHiding: true,
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
      },
      {
        accessorKey: 'age',
        id: 'age',
        enableHiding: true,
        header: 'Age',
        // cell: (info) => (editableRowIndex===info.cell.row.index? info.getValue(): null),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'visits',
        id: 'visits',
        enableHiding: true,
        header: 'Visits',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'status',
        id: 'status',
        enableHiding: true,
        header: 'Status',
        cell: info => info.getValue(),
        footer: props => props.column.id,
      },
      {
        accessorKey: 'progress',
        id: 'progress',
        enableHiding: true,
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
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
                {headerGroup.headers.map(header => (
                  <DndProvider backend={HTML5Backend}>
                    <DraggableColumnHeader
                      key={header.id}
                      header={header}
                      table={table}
                    />
                  </DndProvider>
                ))}
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
    </div>
  )
}
export default TablePage;