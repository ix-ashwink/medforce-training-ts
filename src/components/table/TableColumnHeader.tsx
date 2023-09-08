import { FC, useMemo } from 'react';
import { Column, Table, Header, flexRender, ColumnOrderState } from '@tanstack/react-table';
import { useDrag, useDrop } from 'react-dnd';
import DebouncedInput from './DebouncedInput';

function Filter({ column, table, }: {
  column: Column<unknown, unknown>
  table: Table<unknown>
}) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = useMemo( () =>
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
        {sortedUniqueValues.slice(0, 5000).map((value: string) => (
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

const reorderColumn = ( draggedColumnId: string, targetColumnId: string, columnOrder: string[] ): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder]
}

const DraggableColumnHeader: FC<{ header: Header<unknown, unknown>, table: Table<unknown> }> = ({ header, table }) => {
  const { getState, setColumnOrder } = table;
  const { columnOrder } = getState();
  const { column } = header;
  
  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<unknown>) => {
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
      key={header.id}
      ref={dropRef}
      colSpan={header.colSpan}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className = {header.column.id === 'actions'? 'sticky-Col':''}
    >
      <div ref={previewRef}>
        {header.isPlaceholder
          ? null
          : (
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
          )
        }
        {
          header.column.id !== 'actions' &&
          <button ref={dragRef}>🟰</button>
        }
      </div>
    </th>
  )
}
export default DraggableColumnHeader;

