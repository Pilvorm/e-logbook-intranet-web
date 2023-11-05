import { useState, useReducer, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Table
} from "reactstrap";
import {
  Search,
} from 'react-feather';
import { useRouter } from "next/router";

const ModalAddPic = ({ isOpen, toggle, onSubmit }) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const router = useRouter();
  const [selected, setSelected] = useState("");
  
  const [dummyData, setDummyData] = useState([
    {
      nik: "012345678",
      name: "John Wick",
      department: "Produksi Line 1",
      company: "PT. Kalbe Farma",
      role: "Operator",
      isChecked: false
    },
    {
      nik: "123456789",
      name: "John Doe",
      department: "Produksi Line 1",
      company: "PT. Kalbe Farma",
      role: "Operator",
      isChecked: false
    },
  ]);

  const CreateTableRow = ({
    data, key, onClick, selected
  }) => {
    return (
      <tr onClick={() => onClick()} style={{backgroundColor: selected.name === data.name ? "#46a583" : "white", color: selected.name === data.name && "white"}} >
        <td>{data.name}</td>
        <td>{data.company}</td>
        <td>{data.department}</td>
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
                <h1 className="">PIC Capa</h1>
              </div>
            </ModalHeader>
          </div>
          <ModalBody>
            <div className="align-items-center mb-2 p-2 w-100">
              <div className="d-flex align-items-center">
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
                  <th className="text-left">Nama</th>
                  <th className="text-left">Perusahaan</th>
                  <th className="text-left">Dept</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((data, index) => (
                  <CreateTableRow onClick={() => setSelected(data)} key={index} {...{ data, router, token: "" }} selected={selected} />
                ))}
              </tbody>
            </Table>
          </ModalBody>
          <div style={{ width: "95%" }} className="ml-2">
            <ModalFooter style={{ borderTop: "2px solid #c6c3c3" }}>
              <Button color="success" outline onClick={() => toggle(!isOpen)}>
                Cancel
              </Button>
              <Button color="success" onClick={() => onSubmit(selected)}>
                Submit
              </Button>
            </ModalFooter>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default ModalAddPic;
