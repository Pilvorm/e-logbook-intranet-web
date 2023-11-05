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
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

import debounce from "lodash/debounce";

const ModalFilterNearmiss = ({ visible, toggle, dataSBU }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if(!(dataSBU.find(data => data.label === "All"))) {
      dataSBU.unshift({value:"", label: "All"});
    }
  }, []);

  const [selectedCompany, setSelectedCompany] = useState("");

  const query = router.query ?? {};

  const loadOptionsSBU = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsSBU(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const getCompanyQuery = dataSBU.filter(
    (company) => company.idmCompCode === query.companyCode
  );

  const onSubmit = (values, actions) => {
    const {
      nomorDokumen,
      lokasiKejadian,
      potensiBahaya,
      investigasiNearmiss,
      namaYangTerlibat,
      companyCode,
    } = values;

    router.push({
      pathname: router.pathname,
      query: {
        pageSize: 10,
        pageNumber: 1,
        search: "",
        nomorDokumen: nomorDokumen ?? "",
        potensiBahaya: potensiBahaya ?? "",
        lokasiKejadian: lokasiKejadian ?? "",
        investigasiNearmiss: investigasiNearmiss ?? "",
        namaYangTerlibat: namaYangTerlibat ?? "",
        // username: username ?? "",
        // companyCode: companyCode ?? "",
        // email: email ?? "",
        // roleName: roleName ?? "",
      },
    });
  };

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal isOpen={visible} toggle={toggle} size="lg" centered>
          <div>
            <ModalHeader className="text-secondary bg-light" toggle={toggle}>
              Filter Nearmiss
            </ModalHeader>
          </div>
          <Formik
            enableReinitialize
            initialValues={{
              // name: query?.name ?? "",
              // username: query?.username ?? "",
              //companyCode: query?.companyCode ?? "",
              // email: query?.email ?? "",
              // roleName: query?.roleName ?? "",
              nomorDokumen: query?.nomorDokumen ?? "",
              lokasiKejadian: query?.lokasiKejadian ?? "",
              potensiBahaya: query?.potensiBahaya ?? "",
              investigasiNearmiss: query?.investigasiNearmiss ?? "",
              namaYangTerlibat: query?.namaYangTerlibat ?? "",
            }}
            // validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              setFieldValue,
              handleSubmit,
              handleChange,
              isSubmitting,
            }) => (
              <>
                <ModalBody>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Nomor Dokumen</Label>
                        <Input
                          type="text"
                          placeholder="Nomor Dokumen"
                          name="nomorDokumen"
                          value={values.nomorDokumen}
                          onChange={handleChange("nomorDokumen")}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Lokasi kejadian</Label>
                        <Input
                          type="text"
                          placeholder="Lokasi kejadian"
                          name="lokasiKejadian"
                          value={values.lokasi}
                          onChange={handleChange("lokasiKejadian")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Company</Label>
                        <Select
                        id="company"
                        name="companyCode"
                          classNamePrefix="select"
                          placeholder=""
                          cacheOptions
                          defaultValue={{
                            label: getCompanyQuery[0]?.name ?? "Search...",
                            value: getCompanyQuery[0]?.idmCompCode,
                          }}
                          options={dataSBU}
                          onChange={(e) => {
                            setFieldValue("companyCode", e.idmCompCode);
                            setSelectedCompany(e);
                          }}
                        ></Select>
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Potensi bahaya</Label>
                        <Input
                          type="text"
                          placeholder="Potensi Bahaya"
                          name="potensiBahaya"
                          value={values.potensiBahaya}
                          onChange={handleChange("potensiBahaya")}
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
                          name="namaYangTerlibat"
                          value={values.namaYangTerlibat}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">
                          Investigasi Nearmiss
                        </Label>
                        <Input
                          type="text"
                          placeholder="Investigasi Nearmiss"
                          name="investigasiNearmiss"
                          value={values.investigasiNearmiss}
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
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span className="ml-50">Submitting...</span>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    color="success"
                    outline
                    onClick={() => toggle(!isOpen)}
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </>
            )}
          </Formik>
        </Modal>
      </div>
    </div>
  );
};
export default ModalFilterNearmiss;
