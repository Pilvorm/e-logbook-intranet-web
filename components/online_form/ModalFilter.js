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

const ModalFilterOnlineForm = ({ isOpen, toggle }) => {
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
                  <Label className="form-label">Lokasi kecelakaan kerja</Label>
                  <Input
                    type="text"
                    placeholder="Lokasi kecelakaan kerja"
                    name="lokasi_kecelakaan_kerja"
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
                  <Label className="form-label">Aktivitas / Kegiatan Korban di Lokasi</Label>
                  <Input
                    type="text"
                    placeholder="Aktivitas / Kegiatan Korban di Lokasi"
                    name="aktivitas_korban"
                    // value={formik.values.material_code}
                    // {...formik.getFieldProps("material_code")}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <FormGroup className="custom-input-select" md="6">
                  <Label className="form-label">Jenis Kejadian</Label>
                  <Input
                    type="text"
                    placeholder="Jenis Kejadian"
                    name="jenis_kejadian"
                    // value={formik.values.material_code}
                    // {...formik.getFieldProps("material_code")}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup className="custom-input-select" md="6">
                  <Label className="form-label">Insiden yang dialami</Label>
                  <Input
                    type="text"
                    placeholder="Insiden yang dialami"
                    name="insiden_yang_dialami"
                    // value={formik.values.material_code}
                    // {...formik.getFieldProps("material_code")}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <div style={{ width: "95%" }} className="ml-2">
            <ModalFooter style={{ borderTop: "2px solid #c6c3c3" }}>
              <Button color="success" onClick={() => toggle(!isOpen)}>
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
export default ModalFilterOnlineForm;
