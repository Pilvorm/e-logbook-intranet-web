import React, { useState } from 'react';
import {
    Table,
    Input
} from 'reactstrap';
import {
    Download,
    Eye,
    Trash,
    Calendar,
    PlusCircle,
    X,
    Check
} from 'react-feather';
import DatePicker from "react-datepicker";
import ModalAddPic from './ModalAddPic';

const CorrectiveAction = ({
dummyData, handleCancel, handleAdd, onChange
}) => {

    const [visibleAddModal, setVisibleAddModal] = useState(false);
    const [dataIndex, setDataIndex] = useState(null)

    return (
        <div>
            {
                visibleAddModal &&
                <ModalAddPic isOpen={visibleAddModal} toggle={() => setVisibleAddModal(false)}
                    onSubmit={(data) => {
                        dummyData[dataIndex].picCapa = data.name;
                        onChange()
                        setVisibleAddModal(false)
                    }}
                />
            }
            <Table responsive className="border mb-1">
                <thead>
                    <tr>
                        <th className="w-5 text-left">Action</th>
                        <th className="text-left">No</th>
                        <th className="text-left">Tindakan</th>
                        <th className="text-left">Due Date</th>
                        <th className="text-left">pic capa</th>
                        <th className="text-left">Dept</th>
                        <th className="text-left">bukti</th>
                    </tr>
                </thead>
                <tbody>
                {dummyData.map((data, index) => (
                    <>
                    {
                        !data.isNew ?
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
                                <td>{data.tindakan}</td>
                                <td>{data.dueDate}</td>
                                <td>{data.picCapa}</td>
                                <td>{data.dept}</td>
                                <td>{data.bukti}</td>
                            </tr>
                            :
                            <tr key={index}>
                                <td>
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
                                        placeholde="tindakan" 
                                        value={data.tindakan}
                                        onChange={(e) => {
                                            data.tindakan = e.target.value;
                                            onChange()
                                        }}
                                    />
                                </td>
                                <td>
                                <div className="form-control d-flex justify-content-between align-items-center pl-0">
                                    <DatePicker
                                    placeholderText="Placeholder"
                                    dateFormat="dd MMM yyyy"
                                    showMonthDropdown
                                    showYearDropdown
                                    selected={new Date()}
                                    dropdownMode="select"
                                    className="form-control w-100 border-left-0 border-right-0"
                                    />
                                    <div className="mx-50"></div>
                                    <Calendar size={18} />
                                </div>
                                </td>
                                <td>
                                    <Input 
                                        placeholder="pic"
                                        value={data.picCapa}
                                        onClick={() => {
                                            setVisibleAddModal(true)
                                            setDataIndex(index)
                                        }}
                                    />
                                </td>
                                <td>
                                    <Input 
                                        placeholder="departemen"
                                        onChange={(e) => {
                                            data.dept = e.target.value;
                                            onChange()
                                        }}
                                        value={data.dept}
                                    />
                                </td>
                                <td className="cursor-pointer">
                                    <PlusCircle />
                                </td>
                            </tr>
                    }
                    </>
                ))}
                </tbody>
          </Table>
        </div>
    )
};

export default CorrectiveAction;