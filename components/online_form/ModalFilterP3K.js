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
  } from "reactstrap";
  import Select from "react-select";
  
  const ModalFilterP3K = ({ visible, toggle }) => {
    const dropdownOptions = [
      { value: "APD", label: "APD" },
      { value: "APAR", label: "APAR" },
    ];
    return (
      <div className="demo-inline-spacing">
        <div>
          <Modal
            size="lg"
            centered
            isOpen={visible} toggle={toggle}
          >
            <ModalHeader className="text-secondary bg-light" toggle={toggle}>
              Filter
            </ModalHeader>
            <ModalBody>
              <Row>
                <Col sm="6">
                  <FormGroup className="custom-input-select" md="6">
                    <Label className="form-label">Nomor Dokumen</Label>
                    <Input
                      type="text"
                      placeholder="Nomor Dokumen"
                      name="nomor_dokumen"
                      // value={formik.values.material_code}
                      // {...formik.getFieldProps("material_code")}
                    />
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup className="custom-input-select" md="6">
                    <Label className="form-label">Lokasi kejadian</Label>
                    <Input
                      type="text"
                      placeholder="Lokasi kejadian"
                      name="lokasi_kejadian"
                      // value={formik.values.material_code}
                      // {...formik.getFieldProps("material_code")}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <FormGroup className="custom-input-select" md="6">
                    <Label className="form-label">Site</Label>
                    <Select
                      classNamePrefix="select"
                      placeholder=""
                      options={dropdownOptions}
                    ></Select>
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup className="custom-input-select" md="6">
                    <Label className="form-label">Potensi bahaya</Label>
                    <Input
                      type="text"
                      placeholder="Potensi bahaya"
                      name="potensi_bahaya"
                      // value={formik.values.material_code}
                      // {...formik.getFieldProps("material_code")}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <FormGroup className="custom-input-select" md="6">
                    <Label className="form-label">
                      Nama yang terlibat kejadian
                    </Label>
                    <Input
                      type="text"
                      placeholder="Nama yang terlibat kejadian"
                      name="nama_yang_terlibat"
                      // value={formik.values.material_code}
                      // {...formik.getFieldProps("material_code")}
                    />
                  </FormGroup>
                </Col>
                <Col sm="6">
                  <FormGroup className="custom-input-select" md="6">
                    <Label className="form-label">Investigasi Nearmiss</Label>
                    <Input
                      type="text"
                      placeholder="Investigasi Nearmiss"
                      name="investigasi_nearmiss"
                      // value={formik.values.material_code}
                      // {...formik.getFieldProps("material_code")}
                    />
                  </FormGroup>
                </Col>
              </Row>
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
  export default ModalFilterP3K;
  