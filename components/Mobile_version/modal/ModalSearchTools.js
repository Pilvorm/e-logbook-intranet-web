import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import {
  Search
} from 'react-feather';
import { Paper } from "@mui/material";
import { useReducer, useState } from "react";

const ModalSearchTools = ({ isOpen, toggle, onConfirm }) => {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [indexActive, setIndexActive] = useState(null);
  const [dataActive, setDataActive] = useState(null);
  const dummyData = [
    {
      no: "1",
      type: "type 1",
      location: "Jakarta",
      area: "DKI Jakarta",
      isClick: false
    },
    {
      no: "2",
      type: "type 2",
      location: "Cikarang",
      area: "Jawa Barat",
      isClick: false
    },
    {
      no: "2",
      type: "type 2",
      location: "Cikarang",
      area: "Jawa Barat",
      isClick: false
    },
    {
      no: "2",
      type: "type 2",
      location: "Cikarang",
      area: "Jawa Barat",
      isClick: false
    },
    {
      no: "2",
      type: "type 2",
      location: "Cikarang",
      area: "Jawa Barat",
      isClick: false
    },
  ]
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
                <h5 className="">Nomor Peralatan</h5>
              </div>
            </ModalHeader>
          </div>
          <ModalBody>
            <Row>
              <Col sm="6">
              <InputGroup className="input-group-merge">
                <Input
                  className="search-table2 w-50"
                  type="text"
                  name="search"
                  id="search-master-user"
                  placeholder="Search"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      // dispatch(setSearch(e.target.value));
                    }
                  }}
                  // value={tempSearchQuery || searchQuery}
                  onChange={(e) => {
                    // setTempSearchQuery(e.target.value);
                  }}
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText>
                    <Search
                      // onClick={() => dispatch(setSearch(tempSearchQuery))}
                      size={14}
                    />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              </Col>
            </Row>
            <Row className="mt-1"
              style={{
                maxHeight: 400,
                overflow: 'auto'
              }}
            >
              {
                dummyData.map((item, index) => (
                  <Col key={index}  sm="6" className="mt-1">
                    <Paper elevation={4}
                      onClick={() => {
                        setIndexActive(index)
                        setDataActive(item)
                      }}
                      className={`${indexActive === index ? "bg-success text-white" : 'white'}`}
                    >
                      <div className="d-flex py-1"
                        style={{
                          width: '90%',
                          margin: 'auto',
                          gap: 30
                        }}
                      >
                        <div>
                          <p>No. Peralatan</p>
                          <p>Jenis Peralatan</p>
                          <p>Lokasi</p>
                          <p>Area</p>

                        </div>
                        <div>
                          <p>{item.no}</p>
                          <p>{item.type}</p>
                          <p>{item.location}</p>
                          <p>{item.area}</p>
                        </div>
                      </div>
                    </Paper>
                  </Col>
                ))
              }
            </Row>
          </ModalBody>
          <div style={{ width: "95%" }} className="ml-2">
            <ModalFooter style={{ borderTop: "2px solid #c6c3c3" }}>
              <Button color="success" onClick={() => {
                onConfirm(dataActive)
                toggle(!isOpen)
              }}>
                Submit
              </Button>
              <Button color="success" outline onClick={() => toggle(!isOpen)}>
                Cancel
              </Button>
            </ModalFooter>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default ModalSearchTools;
