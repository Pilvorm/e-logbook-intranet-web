import { useEffect, useState } from "react";
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
} from "reactstrap";
import Select from "react-select";
import axios from "axios";

const ModalFilter = ({
  isOpen,
  toggle,
  handleFilterQuery,
  filterQuery,
  setFilterQuery,
  token,
}) => {
  const [jenisPeralatanOptions, setJenisPeralatanOptions] = useState([]);
  //Function untuk get Lov Lokasi dari master Lokasi
  const hitGetLovJenisPeralatan = async () => {
    await axios({
      url: "/api/Lov/jenisPeralatan",
      method: "GET",
      headers: {
        AppAuthorization: token,
      },
    })
      .then((res) => {
        const data = res.data.data;
        const newData = data.map((x) => {
          return {
            value: x.jenisPeralatan,
            label: x.jenisPeralatan,
          };
        });

        setJenisPeralatanOptions(newData);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(async () => {
    await hitGetLovJenisPeralatan();
  }, []);

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
                <h1 className="">Filter</h1>
              </div>
            </ModalHeader>
          </div>
          <ModalBody>
            <Row>
              <Col sm="6">
                <FormGroup className="custom-input-select" md="6">
                  <Label className="form-label">Nomor Peralatan</Label>
                  <Input
                    type="text"
                    // placeholder="Nomor Peralatan"
                    name="nomor_peralatan"
                    // value={formik.values.material_code}
                    // {...formik.getFieldProps("material_code")}
                    value={filterQuery.nomorPeralatan}
                    onChange={(e) => {
                      setFilterQuery({
                        ...filterQuery,
                        nomorPeralatan: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <FormGroup className="custom-input-select" md="6">
                  <Label className="form-label">Kategori</Label>
                  <Select
                    isClearable={true}
                    classNamePrefix="select"
                    placeholder=""
                    options={jenisPeralatanOptions}
                    value={{
                      value: filterQuery.jenisPeralatan,
                      label: filterQuery.jenisPeralatan,
                    }}
                    onChange={(e) => {
                      console.log(e);
                      if (e) {
                        setFilterQuery({
                          ...filterQuery,
                          jenisPeralatan: e.value,
                        });
                      } else {
                        setFilterQuery({
                          ...filterQuery,
                          jenisPeralatan: "",
                        });
                      }
                    }}
                  ></Select>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <FormGroup className="custom-input-select" md="6">
                  <Label className="form-label">Lokasi</Label>
                  <Input
                    type="text"
                    // placeholder="Lokasi"
                    name="nomor_peralatan"
                    // value={formik.values.material_code}
                    // {...formik.getFieldProps("material_code")}
                    value={filterQuery.lokasi}
                    onChange={(e) =>
                      setFilterQuery({
                        ...filterQuery,
                        lokasi: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <FormGroup className="custom-input-select" md="6">
                  <Label className="form-label">Area</Label>
                  <Input
                    type="text"
                    // placeholder="Area"
                    name="area"
                    // value={formik.values.material_code}
                    // {...formik.getFieldProps("material_code")}
                    value={filterQuery.area}
                    onChange={(e) =>
                      setFilterQuery({
                        ...filterQuery,
                        area: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <div style={{ width: "95%" }} className="ml-2">
            <ModalFooter style={{ borderTop: "2px solid #c6c3c3" }}>
              <div className="d-flex justify-content-center justify-content-sm-between w-100 flex-wrap">
                <div>
                  <Button
                    color="danger"
                    onClick={() => {
                      setFilterQuery({
                        nomorPeralatan: "",
                        jenisPeralatan: "",
                        lokasi: "",
                        area: "",
                      });
                    }}
                  >
                    <div className="d-flex" style={{ alignItems: "center" }}>
                      {/* <Trash size={15} /> */}
                      <div className="">Clear</div>
                    </div>
                  </Button>
                </div>
                <div>
                  <Button
                    color="success"
                    onClick={() => {
                      handleFilterQuery(filterQuery);
                      toggle(!isOpen);
                    }}
                    className="mx-1"
                  >
                    Submit
                  </Button>
                  <Button
                    color="success"
                    outline
                    onClick={() => toggle(!isOpen)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </div>
        </Modal>
      </div>
    </div>
  );
};
export default ModalFilter;
