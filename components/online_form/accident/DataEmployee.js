import React from 'react';
import {
    Table,
} from 'reactstrap';

const DataEmployee = ({

}) => {

    const CreateTableRow = () => {

    };

    return (
        <div>
            <Table responsive className="border">
            <thead>
              <tr>
                <th className="text-left">Action</th>
                <th className="w-5 text-left">No</th>
                <th className="text-left">NIK</th>
                <th className="text-left">Nama</th>
                <th className="text-left">Dept</th>
                <th className="text-left">Jenis Kelamin</th>
                <th className="text-left">Jabatan</th>
              </tr>
            </thead>
            <tbody>
              {[].map((data) => (
                <CreateTableRow key={data?.id} {...{ data, router, token }} />
              ))}
            </tbody>
          </Table>
        </div>
    )
};

export default DataEmployee;