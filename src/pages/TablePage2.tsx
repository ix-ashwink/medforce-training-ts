import { useState, useMemo } from 'react';
import '../style/table.css';
import { ColumnDef } from '@tanstack/react-table'

import { makeData, Person } from '../data/makeData';
import Table from '../components/table/Table';

const TablePage2 = () => {

  const [data, setData] = useState<Person[]>(() => makeData(1000));
  const [editableRowIndex, setEditableRowIndex] = useState<number>(-1);
  
  const handleEditClick = (rowIndex: number) => {
    setEditableRowIndex(rowIndex);
  }

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

  return (
    <Table data={data} columns={columns} />
  )
}
export default TablePage2;