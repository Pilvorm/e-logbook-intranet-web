import React from 'react';
import {
    Table,
    Input
} from 'reactstrap';
import {
    Download,
    Eye,
    Trash,
    X,
    Check
} from 'react-feather';

const EvidenceAccident = ({
dummyData, handleAdd, handleCancel
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
                {dummyData.map((data, index) => (
                    <>
                    {
                        data.isNew ? 
                            <tr key={index}>
                                <td className="cursor-pointer">
                                    <div className="d-flex" style={{gap: 10}}>
                                        <div className="cursor-pointer" onClick={() => {handleCancel()}}>
                                            <X />
                                        </div>
                                        <div className="cursor-pointer" onClick={() => {
                                            data.isNew = false;
                                            handleAdd()
                                        }}>
                                            <Check />
                                        </div>
                                    </div>
                                </td>
                                <td>{index + 1}</td>
                                <td>
                                    <Input 
                                        placeholder="keterangan"
                                    />
                                </td>
                                <td>
                                    <Input 
                                        placeholder="nama file"
                                    />
                                </td>
                            </tr>
                            :
                            <tr key={index}>
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
                                <td>{index + 1}</td>
                                <td>{data.keterangan}</td>
                                <td>{data.fileName}</td>
                            </tr>
                    }
                    </>
                ))}
                </tbody>
          </Table>
        </div>
    )
};

export default EvidenceAccident;