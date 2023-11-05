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
import { Formik } from "formik";

const ModalDataNonKaryawan = ({ visible, toggle }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const query = router.query ?? {};

  const onSubmit = (values, actions) => {
    const { name, company, jenisKelamin } = values;

    let bodyData = {
      name,
      company,
      jenisKelamin,
    };
    console.log("DATA NON KARYAWAN");
    console.log(bodyData);
  };

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal isOpen={visible} toggle={toggle} size="lg" centered>
          <ModalHeader className="text-secondary bg-light" toggle={toggle}>
            Data Korban Non-Karyawan
          </ModalHeader>
          <Formik
            enableReinitialize
            initialValues={{
              nik: "",
              name: "",
              department: "",
              jenisKelamin: "",
              jabatan: "",
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
                        <Label className="form-label">Nama</Label>
                        <Input
                          type="text"
                          placeholder="Name"
                          name="name"
                          value={values.name}
                          onChange={handleChange("name")}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Perusahaan</Label>
                        <Input
                          type="text"
                          placeholder="Company"
                          name="company"
                          value={values.company}
                          onChange={handleChange("company")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Jenis Kelamin</Label>
                        <Input
                          type="text"
                          placeholder="Jenis Kelamin"
                          name="jenisKelamin"
                          value={values.jenisKelamin}
                          onChange={handleChange("jenisKelamin")}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Jabatan</Label>
                        <Input
                          type="text"
                          placeholder="Jabatan"
                          name="jabatan"
                          value={values.jabatan}
                          onChange={handleChange("jabatan")}
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
                </ModalFooter>
              </>
            )}
          </Formik>
        </Modal>
      </div>
    </div>
  );
};

export default ModalDataNonKaryawan;
