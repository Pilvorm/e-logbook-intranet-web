import React, { useState } from "react";
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
  Spinner,
  Table,
} from "reactstrap";
import Select from "react-select";

const ModalSearchUsername = ({ visible, toggle }) => {

  const [searchQuery, setSearchQuery] = useState("");

  const dropdownOptions = [
    { value: "APD", label: "APD" },
    { value: "APAR", label: "APAR" },
  ];

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal size="lg" centered isOpen={visible} toggle={toggle}>
          <ModalHeader className="text-secondary bg-light" toggle={toggle}>
            Search Username
          </ModalHeader>
          <ModalBody>
            <Input
              className="search-table2 mt-1 mb-2"
              type="text"
              name="search"
              placeholder="john.doe@kalbe.co.id"
              value={searchQuery}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearchQuery();
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Table responsive className="border">
              <thead className="text-center">
                <tr>
                  <th>Nama</th>
                  <th>Site</th>
                  <th>Departemen</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* {dummyData.map((data) => (
                  <CreateTableRow
                    key={data?.no}
                    {...{ data, router, token: "" }}
                  />
                ))} */}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              id="submitBtn"
              name="submitBtn"
              onClick={() => toggle(!isOpen)}
            >
              {/* {isSubmitting ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span className="ml-50">Submitting...</span>
                  </>
                ) : (
                  "Save"
                )} */}
              Submit
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};
export default ModalSearchUsername;
