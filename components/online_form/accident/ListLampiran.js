import React from 'react';
import {
    Table
} from 'reactstrap';
import {
    Download,
    Eye,
    Trash
} from 'react-feather';

const ListLampiran = ({
dummyData
}) => {

    return (
        <div>
            <Table responsive className="border mb-1">
                <thead>
                <tr>
                    <th className="w-5 text-left">Action</th>
                    <th className="text-left">No</th>
                    <th className="text-left">Keterangan</th>
                    <th className="text-left">Nama File</th>
                </tr>
                </thead>
                <tbody>
                {dummyData.map((data) => (
                    <tr>
                        <td className="cursor-pointer">
                            <div className="d-flex w-5 text-left" style={{gap: 10}}>
                                <div
                                    onClick={() => {}}
                                >
                                    <Download />
                                </div>
                                <div
                                    onClick={() => {}}
                                >
                                    <Eye />
                                </div>
                                <div
                                    onClick={() => {}}
                                >
                                    <Trash />
                                </div>
                            </div>
                        </td>
                        <td>{data.no}</td>
                        <td>APAR</td>
                        <td>APAR</td>
                    </tr>
                ))}
                </tbody>
          </Table>
        </div>
    )
};

export default ListLampiran;