import { COMPANY_DATA } from "constant";
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
import { getPermissionComponentByRoles } from "helpers/getPermission";

const ModalFilterUser = ({
  visible,
  toggle,
  sessionData,
  handleFilterQuery,
  filterQuery,
  setFilterQuery,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const query = router.query ?? {};

  const [selectedCompany, setSelectedCompany] = useState(
    filterQuery.compName === "" ? "Search..." : filterQuery.compName
  );

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal isOpen={visible} toggle={toggle} size="lg" centered>
          <ModalHeader className="text-secondary bg-light" toggle={toggle}>
            Filter User
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
                        <Label className="form-label">Name</Label>
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
                            label: selectedCompany ?? "Search...",
                            value: selectedCompany ?? "",
                          }}
                          defaultOptions={COMPANY_DATA}
                          onChange={(e) => {
                            console.log(e);
                            setSelectedCompany(e.label);
                            if (e) {
                              setFilterQuery({
                                ...filterQuery,
                                compName: e.name,
                              });
                            } else {
                              setFilterQuery({
                                ...filterQuery,
                                compName: "",
                              });
                            }
                          }}
                          placeholder="Search..."
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Email</Label>
                        <Input
                          type="text"
                          placeholder="Email"
                          name="email"
                          value={filterQuery.email}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              email: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Role</Label>
                        <Input
                          type="text"
                          placeholder="Role Name"
                          name="userRoles"
                          value={filterQuery.userRoles}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              userRoles: e.target.value,
                            });
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <div className="d-flex justify-content-end w-100">
                    <Button
                      color="danger"
                      id="submitBtn"
                      name="submitBtn"
                      className="mr-2"
                      outline
                      onClick={() => {
                        resetForm();
                        setSelectedCompany("Search...");
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

export default ModalFilterUser;
