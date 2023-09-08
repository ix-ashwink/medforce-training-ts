import { FC, useState } from 'react';
import { Table } from "@tanstack/react-table";
import DebouncedInput from "./DebouncedInput";
import exportExcel from '../../utils/excelExport';

interface TableHeaderProps {
    setFilter: ( globalFilter: string) => void;
    table: Table<unknown>,
}

const TableHeader: FC<TableHeaderProps> = ({setFilter, table}) => {
    
    const [globalFilter, setGlobalFilter] = useState<string>('');

    const filter = (value:string) => {
        setFilter(value);
        setGlobalFilter(value);
    }

    const exportCSV = () => {
        exportExcel(table, 'tabledata', true);
    }

    return (
        <>
        <div className='col d-flex g-0 text-start mb-2'>
            <DebouncedInput
                value= {globalFilter ?? ''}
                onChange= {value => filter(String(value))}
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
                        <label>
                            <input
                            {...{
                                type: 'checkbox',
                                checked: column.getIsVisible(),
                                onChange: column.getToggleVisibilityHandler(),
                                disabled: (column.columnDef.enableHiding !== true)
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
        </>
    )
}
export default TableHeader;