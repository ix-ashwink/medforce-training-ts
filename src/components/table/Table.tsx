import { useState, useEffect, FC } from 'react';
import '../../style/table.css';
import { 
    useReactTable, ColumnFiltersState, ColumnOrderState, getCoreRowModel, getFilteredRowModel, getFacetedRowModel,
    getFacetedUniqueValues, getFacetedMinMaxValues, getPaginationRowModel, getSortedRowModel, ColumnDef, flexRender, RowData,
} from '@tanstack/react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableColumnHeader from './TableColumnHeader';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
      updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    }
}

interface TableProps {
    data: unknown[];
    columns: ColumnDef<unknown>[];
    // defaultColumn: Partial<ColumnDef<any>>;
}

const Table: FC<TableProps> = ({ data, columns }) => {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [columnVisibility, setColumnVisibility] = useState({});
    //must start out with populated columnOrder so we can splice
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(columns.map(column => column.id as string));
    // Give our default column cell renderer editing superpowers!
    const defaultColumn: Partial<ColumnDef<unknown>> = {
        cell: function Cell ({ getValue, row: { index }, column: { id }, table }) {
        
            const initialValue = getValue();
            const [value, setValue] = useState(initialValue);
        
            // When the input is blurred, we'll call our table meta's updateData function
            const onBlur = () => { table.options.meta?.updateData(index, id, value) }
        
            useEffect(() => {
                setValue(initialValue);
            }, [initialValue]);
        
            return (
                <input
                    value={value as string}
                    onChange={e => setValue(e.target.value)}
                    onBlur={onBlur}
                />
            )
        }
    }

    const resetTable = () => {
        table.resetPagination();
        table.resetColumnFilters();
        table.resetGlobalFilter();
        table.resetRowSelection();
        table.resetSorting();
        table.resetColumnVisibility();
        resetOrder();
    }

    const resetOrder = () => {
        setColumnOrder(columns.map(column => column.id as string));
    }

    let table = useReactTable({
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
    });

    return (
        <div className="row p-2 mt-3">
            <TableHeader setFilter= {setGlobalFilter} table= {table} />
            <div className='g-0 mb-2 scrollable'>
                <table> 
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <DndProvider backend={HTML5Backend}>
                                    <DraggableColumnHeader key={header.id} header={header} table={table} />
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
                                    <td key={cell.id}
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
            <TableFooter {...table = table} />
            <div>
                <button
                    className='mx-1 p-2 border-1 rounded' 
                    onClick={() => resetTable()}
                >
                    Reset
                </button>
                <button
                    className='mx-1 p-2 border-1 rounded'  
                //   onClick={() => refreshData()}
                >
                    Refresh Data
                </button>
            </div>
        </div>
    )
}
export default Table;