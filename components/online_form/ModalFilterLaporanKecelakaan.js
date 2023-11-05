import React, { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { wrapper } from "redux/store";
import { getAsyncOptionsSBU } from "helpers/sbu";

const ModalFilterLaporanKecelakaan = ({
  visible,
  toggle,
  dataSBU,
  handleFilterQuery,
  filterQuery,
  setFilterQuery,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (!dataSBU.find((data) => data.label === "All")) {
  //     dataSBU.unshift({ value: "", label: "All" });
  //   }
  // }, []);

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
    (company) => company.idmCompName === filterQuery.site
  );

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal isOpen={visible} toggle={toggle} size="lg" centered>
          <ModalHeader className="text-secondary bg-light" toggle={toggle}>
            Filter Laporan Kecelakaan
          </ModalHeader>
          <Formik enableReinitialize>
            {({
              values,
              errors,
              setFieldValue,
              handleSubmit,
              handleChange,
              setSubmitting,
              isSubmitting,
            }) => (
              <>
                <ModalBody>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">No. Dokumen</Label>
                        <Input
                          type="text"
                          placeholder="Nomor Dokumen"
                          name="name"
                          value={filterQuery.nomorDokumen}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              nomorDokumen: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">
                          Lokasi Kecelakaan Kerja
                        </Label>
                        <Input
                          type="text"
                          placeholder="Lokasi kecelakaan"
                          name="username"
                          value={filterQuery.lokasiKecelakaan}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              lokasiKecelakaan: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Company</Label>
                        <AsyncSelect
                          id="site"
                          name="site"
                          classNamePrefix="select"
                          isClearable={true}
                          cacheOptions
                          value={{
                            label: filterQuery.site,
                            value: filterQuery.site,
                          }}
                          defaultOptions={dataSBU}
                          loadOptions={loadOptionsSBU}
                          onChange={(e) => {
                            console.log(e);
                            if (e) {
                              setFilterQuery({
                                ...filterQuery,
                                site: e.value,
                              });
                            } else {
                              setFilterQuery({
                                ...filterQuery,
                                site: "",
                              });
                            }
                          }}
                          placeholder="Search..."
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">
                          Aktivitas/Kegiatan Korban di Lokasi
                        </Label>
                        <Input
                          type="text"
                          placeholder="Aktivitas korban"
                          name="email"
                          value={filterQuery.aktivitasKorban}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              aktivitasKorban: e.target.value,
                            });
                          }}
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
                          placeholder="Jenis kejadian"
                          name="roleName"
                          value={filterQuery.jenisInsiden}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              jenisInsiden: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">
                          Incident yang Dialami
                        </Label>
                        <Input
                          type="text"
                          placeholder="Insiden"
                          name="roleName"
                          value={filterQuery.insidenYangDialami}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              insidenYangDialami: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <div className="d-flex justify-content-between w-100">
                    <Button
                      color="danger"
                      id="submitBtn"
                      name="submitBtn"
                      outline
                      onClick={() => {
                        setFilterQuery({
                          nomorDokumen: "",
                          site: "",
                          jenisInsiden: "",
                          tanggalKecelakaan: "",
                          lokasiKecelakaan: "",
                          aktivitasKorban: "",
                          insidenYangDialami: "",
                          creator: "",
                          status: "",
                        });
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      color="success"
                      id="submitBtn"
                      name="submitBtn"
                      onClick={() => {
                        handleFilterQuery(filterQuery);
                        setSubmitting(true);
                      }}
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
                  </div>
                </ModalFooter>
              </>
            )}
          </Formik>
        </Modal>
      </div>
    </div>
  );
};

export default ModalFilterLaporanKecelakaan;
