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
import { searchCompany, getAsyncOptionsSBU } from "helpers/sbu";
import { getPermissionComponentByRoles } from "helpers/getPermission";

import { getAsyncOptionsSchool } from "helpers/master/masterSchool";
import { getAsyncOptionsFaculty } from "helpers/master/masterFaculty";
import { getAsyncOptionsDepartment } from "helpers/master/masterDepartment";

const ModalFilterIntern = ({
  visible,
  toggle,
  sessionData,
  handleFilterQuery,
  filterQuery,
  setFilterQuery,
  ...props
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isSystemAdmin = getPermissionComponentByRoles(["HSSE-SYSADMIN"]);
  const isSuperUser = getPermissionComponentByRoles(["HSSE-SU"]);

  const query = router.query ?? {};

  // handling search site
  const getAsyncOptionsCompany = (inputText) => {
    return searchCompany(inputText).then((resp) => {
      return resp.data.map((singleData) => ({
        ...singleData,
        value: singleData.companyName,
        label: singleData.companyName,
      }));
    });
  };

  const loadOptionsCompany = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsCompany(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const loadOptionsSchool = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsSchool(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const loadOptionsFaculty = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsFaculty(inputText).then((options) => callback(options));
      }
    }, 1000),
    []
  );

  const loadOptionsDepartment = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsDepartment(inputText).then((options) =>
          callback(options)
        );
      }
    }, 1000),
    []
  );

  const [selectedCompany, setSelectedCompany] = useState({
    label: "Search...",
    value: "",
  });

  console.log("COMPANY");
  console.log(selectedCompany);

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal isOpen={visible} toggle={toggle} size="lg" centered>
          <ModalHeader className="text-secondary bg-light" toggle={toggle}>
            Filter Intern
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
              resetForm,
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
                          value={filterQuery.name}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              name: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">
                          User Principal Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="User Principal Name"
                          name="userPrincipalName"
                          value={filterQuery.userPrincipalName}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              userPrincipalName: e.target.value,
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
                          id="companyCode"
                          name="companyCode"
                          classNamePrefix="select"
                          cacheOptions
                          value={{
                            label: selectedCompany.label,
                            value: selectedCompany.value,
                          }}
                          // defaultOptions={dataSBU}
                          loadOptions={loadOptionsCompany}
                          onChange={(e) => {
                            console.log(e);
                            setSelectedCompany(e);
                            if (e) {
                              setFilterQuery({
                                ...filterQuery,
                                compName: e.compName,
                              });
                            } else {
                              setFilterQuery({
                                ...filterQuery,
                                compName: "",
                              });
                            }
                          }}
                          placeholder="Search..."
                          isDisabled={isSuperUser}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label font-weight-bold">
                          Department
                        </Label>
                        <AsyncSelect
                          id="school"
                          type="text"
                          placeholder="School/College"
                          classNamePrefix="select"
                          value={filterQuery.email}
                          defaultOptions={props.dataDepartment}
                          loadOptions={loadOptionsDepartment}
                          onChange={handleChange("schoolName")}
                        />
                        {errors.schoolName && (
                          <div className="text-danger">{errors.schoolName}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">School/College</Label>
                        <AsyncSelect
                          id="school"
                          type="text"
                          placeholder="School/College"
                          classNamePrefix="select"
                          value={filterQuery.email}
                          defaultOptions={props.dataSchool}
                          loadOptions={loadOptionsSchool}
                          onChange={handleChange("schoolName")}
                        />
                        {errors.schoolName && (
                          <div className="text-danger">{errors.schoolName}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Faculty</Label>
                        <AsyncSelect
                          id="faculty"
                          type="text"
                          placeholder="Faculty"
                          classNamePrefix="select"
                          value={filterQuery.email}
                          defaultOptions={props.dataFaculty}
                          loadOptions={loadOptionsFaculty}
                          onChange={handleChange("schoolName")}
                        />
                        {errors.schoolName && (
                          <div className="text-danger">{errors.schoolName}</div>
                        )}
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
                        resetForm();
                        setSelectedCompany({
                          label: "Search...",
                          value: "",
                        });
                        setFilterQuery({
                          name: "",
                          userPrincipalName: "",
                          compName: "",
                          email: "",
                          userRoles: "",
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

export default ModalFilterIntern;
