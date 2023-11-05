import React from "react";
import { Table, Input } from "reactstrap";
import Checkbox from "@mui/material/Checkbox";

const DataNonEmployee = ({ dataList, handleChange }) => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <div>
      <Table responsive className="border">
        <thead>
          <tr>
            <th className="text-left">Action</th>
            <th className="w-5 text-left">No</th>
            <th className="text-left">Nama</th>
            <th className="text-left">Perusahaan</th>
            <th className="text-left">Jenis Kelamin</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((data, index) => (
            <>
              {!data.isNew ? (
                <tr>
                  <td>
                    <Checkbox {...label} onClick={() => {}} color="success" />
                  </td>
                  <td>{index + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.company}</td>
                  <td>{data.gender}</td>
                </tr>
              ) : (
                <tr>
                  <td>
                    <div className="d-flex" style={{ gap: 5 }}>
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          dummyDataNonEmployee.shift();
                          forceUpdate();
                        }}
                      >
                        <X color="red" />
                      </div>
                      <div className="cursor-pointer">
                        <Check color="#46a583" />
                      </div>
                    </div>
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <Input
                      type="text"
                      placeholder="nama"
                      name="name"
                      value={data.name}
                      onChange={(e) => {
                        data.name = e.target.value;
                        forceUpdate();
                      }}
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      placeholder="perusahaan"
                      name="company"
                      value={data.company}
                      onChange={(e) => {
                        data.company = e.target.value;
                        forceUpdate();
                      }}
                    />
                  </td>
                  <td>
                    <Select
                      classNamePrefix="select"
                      placeholder="jenis kelamin"
                      options={genderOptions}
                    ></Select>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataNonEmployee;
