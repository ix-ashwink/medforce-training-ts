import { Table } from "@tanstack/react-table";

const TableFooter = (table: Table<unknown>) => {
    
    return (
        <div className="g-0 d-flex align-items-center gap-2 mb-3">
            <div>
                Showing 
                <strong>
                {' '} {(table.getState().pagination.pageSize * table.getState().pagination.pageIndex) + 1}
                {' '} to {' '}
                    {table.getCanNextPage() &&
                        (table.getState().pagination.pageSize * table.getState().pagination.pageIndex) + 
                        table.getState().pagination.pageSize
                    }
                    {!table.getCanNextPage() &&
                        table.getPrePaginationRowModel().rows.length % table.getState().pagination.pageSize
                    }
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
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    table.setPageIndex(page);
                    }}
                    className="border p-1 rounded"
                />
            </span>
            <select
                className="border p-1 rounded"
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
            >
                {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
            </select>
        </div>
    )
}
export default TableFooter;