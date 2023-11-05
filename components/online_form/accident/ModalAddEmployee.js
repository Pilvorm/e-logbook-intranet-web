import { useState, useReducer, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Input,
  Row,
  Col,
  CustomInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Table
} from "reactstrap";
import {
  Plus, Search, X
} from 'react-feather';
import Select from "react-select";
import { useRouter } from "next/router";
import Checkbox from '@mui/material/Checkbox';
import { Pagination } from "components/shared"

const ModalAddEmployee = ({ isOpen, toggle, pageNumber, handlePagination }) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const router = useRouter();
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [selectAll, setSelectAll] = useState(false);
  
  const [dummyData, setDummyData] = useState([
    {
      nik: "012345678",
      name: "John Wick",
      department: "Produksi Line 1",
      role: "Operator",
      isChecked: false
    },
    {
      nik: "123456789",
      name: "John Doe",
      department: "Produksi Line 1",
      role: "Operator",
      isChecked: true
    },
  ]);

  const CreateTableRow = ({
    data, key
  }) => {
    return (
      <tr>
        <td className="cursor-pointer w-5" >
          <Checkbox {...label} checked={data.isChecked} onClick={() => {
            data.isChecked = !data.isChecked;
            setSelectAll(false);
            forceUpdate()
          }} color="success" />
        </td>
        <td>{data.nik}</td>
        <td>{data.name}</td>
        <td>{data.department}</td>
        <td>{data.role}</td>
      </tr>
    )
  };

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal
          size="lg"
          centered
          isOpen={isOpen}
          toggle={() => toggle(!isOpen)}
        >
          <div style={{ width: "95%" }} className="ml-2">
            <ModalHeader
              style={{ borderBottom: "2px solid #c6c3c3" }}
              className="bg-white w-100"
            >
              <div style={{ marginLeft: -20 }}>
                <h1 className="">List Karyawan</h1>
              </div>
            </ModalHeader>
          </div>
          <ModalBody>
            <div className="d-flex flex-wrap" style={{gap: 20}}>
              {
                dummyData.map((item, index) => {
                  return (
                    <>
                    {
                      item.isChecked &&
                        <div key={index} className="d-flex" style={{ backgroundColor: "#e9f4f0", borderRadius: 20, minWidth: 110, alignItems: 'center', paddingLeft: 1}}>
                            <X color="#c43433" />
                            <p style={{paddingTop: 12, paddingLeft: 5}}>{item.name}</p>
                        </div>
                    }
                    </>
                  )
                })
              }
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2 p-2 w-100">
              <div className="d-flex align-items-center mr-2">
                <Label for="rows-per-page">Show</Label>
                <CustomInput
                  className="form-control ml-50 pr-3"
                  type="select"
                  id="rows-per-page"
                  value={"tempPageSize"}
                  // onChange={(e) => handlePageSize(e.target.value)}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </CustomInput>
              </div>

              <div style={{minWidth: '35%'}} className="d-flex align-items-center">
                <InputGroup className="input-group-merge">
                  <Input
                    className="search-table2 w-50"
                    type="text"
                    name="search"
                    id="search-master-user"
                    placeholder="Search"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        dispatch(setSearch(e.target.value));
                      }
                    }}
                    // value={tempSearchQuery || searchQuery}
                    onChange={(e) => {
                      setTempSearchQuery(e.target.value);
                      forceUpdate();
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <InputGroupText>
                      <Search
                        onClick={() => dispatch(setSearch(tempSearchQuery))}
                        size={14}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>
            <Table responsive className="border">
              <thead>
                <tr>
                  <th className="w-5 text-left">
                    <Checkbox {...label} checked={selectAll} onClick={() => {
                      setSelectAll(!selectAll);
                      dummyData.map((el) => {
                        if (!selectAll) {
                          el.isChecked = true;
                        } else if (!selectAll) {
                          el.isChecked = false;
                        }
                      })
                      setDummyData(dummyData)
                      forceUpdate();
                    }} color="success" />
                  </th>
                  <th className="text-left">Nik</th>
                  <th className="text-left">Nama</th>
                  <th className="text-left">Departemen</th>
                  <th className="text-left">Jabatan</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((data, index) => (
                  <CreateTableRow key={index} {...{ data, router, token: "" }} />
                ))}
              </tbody>
            </Table>
            <div style={{width: '100%'}} className="m-auto mr-0 mb-4 ml-1">
              <Pagination totalPage={"1"} {...{ pageNumber, handlePagination }} />
            </div>
          </ModalBody>
          <div style={{ width: "95%" }} className="ml-2">
            <ModalFooter style={{ borderTop: "2px solid #c6c3c3" }}>
              <Button color="success" outline onClick={() => toggle(!isOpen)}>
                Cancel
              </Button>
              <Button color="success" onClick={() => toggle(!isOpen)}>
                Submit
              </Button>
            </ModalFooter>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default ModalAddEmployee;
