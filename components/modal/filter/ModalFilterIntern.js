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
import { Search, Save, Check, ArrowLeft } from "react-feather";
import { Formik } from "formik";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import { wrapper } from "redux/store";
import { getPermissionComponentByRoles } from "helpers/getPermission";
import FormikDatePicker from "components/CustomInputs/CustomDatePicker";

import { searchMentor } from "helpers/master/masterUserInternal";
import UserOptionItem from "components/UserOptionItem";

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

  const isMentor = getPermissionComponentByRoles(["MENTOR"]);
  const isHR = getPermissionComponentByRoles(["HR"]);

  const query = router.query ?? {};

  const [selectedMentor, setSelectedMentor] = useState([]);

  const mentorList = props.dataMentor.data.map((mentor) => ({
    ...mentor,
    label: mentor.name,
    value: mentor.userPrincipalName,
  }));

  const getAsyncOptionsMentor = (inputText) => {
    return searchMentor(inputText).then((resp) => {
      return resp.data.map((singleData) => ({
        ...singleData,
        value: singleData.nik,
        label: singleData.name,
      }));
    });
  };

  const loadOptionsMentor = useCallback(
    debounce((inputText, callback) => {
      if (inputText) {
        getAsyncOptionsMentor(inputText).then((options) => callback(options));
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

  const [selectedCompany, setSelectedCompany] = useState(
    filterQuery.companyName === "" ? "Search..." : filterQuery.companyName
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    filterQuery.dept === "" ? "Search..." : filterQuery.dept
  );
  const [selectedSchool, setSelectedSchool] = useState(
    filterQuery.schoolName === "" ? "Search..." : filterQuery.schoolName
  );
  const [selectedFaculty, setSelectedFaculty] = useState(
    filterQuery.faculty === "" ? "Search..." : filterQuery.faculty
  );

  const onSubmit = (values, actions) => {
    const { startDate, endDate } = values;
    setFilterQuery({
      ...filterQuery,
      startDate,
      endDate,
    });
    actions.setSubmitting(true);
    handleFilterQuery({
      ...filterQuery,
      startDate: startDate,
      endDate: endDate,
    });
  };

  const DropdownIndicator = (props) => {
    return (
      <Search
        set="light"
        primaryColor="blueviolet"
        style={{ padding: "4px", marginRight: "2px" }}
      />
    );
  };

  return (
    <div className="demo-inline-spacing">
      <div>
        <Modal isOpen={visible} toggle={toggle} size="lg" centered>
          <ModalHeader className="text-secondary bg-light" toggle={toggle}>
            Filter Intern
          </ModalHeader>
          <Formik
            enableReinitialize
            initialValues={{
              startDate: filterQuery.startDate || new Date(),
              endDate: filterQuery.endDate || new Date(),
            }}
            onSubmit={onSubmit}
          >
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
                        <Label className="form-label">Mentor</Label>
                        <AsyncSelect
                          // cacheOptions
                          id="nameSearch"
                          // className="dropdownModal"
                          classNamePrefix="select"
                          isSearchable
                          loadOptions={loadOptionsMentor}
                          defaultOptions={mentorList}
                          components={{ DropdownIndicator }}
                          getOptionValue={(option) => option.value}
                          value={filterQuery.mentorName}
                          formatOptionLabel={(data) => (
                            <UserOptionItem
                              key={data?.id}
                              profilePicture={
                                data.profilePicturePath ||
                                "/images/avatars/avatar-blank.png"
                              }
                              // name={`${data?.name} (${data?.email ?? "UPN N/A"})`}
                              name={`${data?.name} (${data?.userPrincipalName})`}
                              subtitle={data?.compName}
                            />
                          )}
                          onChange={(e) => {
                            setFilterQuery({
                              ...filterQuery,
                              mentorName: e.name,
                            });
                            setSelectedMentor(e);
                          }}
                          placeholder={
                            filterQuery.mentorName ||
                            selectedMentor?.name ||
                            "Search by name or email"
                          }
                          isDisabled={isMentor}
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
                                companyName: e.name,
                              });
                            } else {
                              setFilterQuery({
                                ...filterQuery,
                                companyName: "",
                              });
                            }
                          }}
                          placeholder="Search..."
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <FormGroup className="custom-input-select" md="6">
                        <Label className="form-label">Department</Label>
                        <AsyncSelect
                          id="school"
                          type="text"
                          placeholder="Search..."
                          classNamePrefix="select"
                          value={{
                            label: selectedDepartment ?? "Search...",
                            value: selectedDepartment ?? "",
                          }}
                          defaultOptions={props.dataDepartment}
                          loadOptions={loadOptionsDepartment}
                          onChange={(e) => {
                            console.log(e);
                            if (e) {
                              setSelectedDepartment(e.departmentName);
                              setFilterQuery({
                                ...filterQuery,
                                dept: e.departmentName,
                              });
                            } else {
                              setFilterQuery({
                                ...filterQuery,
                                dept: "",
                              });
                            }
                          }}
                        />
                        {errors.dept && (
                          <div className="text-danger">{errors.dept}</div>
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
                          placeholder="Search..."
                          classNamePrefix="select"
                          value={{
                            label: selectedSchool ?? "Search...",
                            value: selectedSchool ?? "",
                          }}
                          defaultOptions={props.dataSchool}
                          loadOptions={loadOptionsSchool}
                          onChange={(e) => {
                            console.log(e);
                            if (e) {
                              setSelectedSchool(e.label);
                              setFilterQuery({
                                ...filterQuery,
                                schoolName: e.schoolName,
                              });
                            } else {
                              setFilterQuery({
                                ...filterQuery,
                                schoolName: "",
                              });
                            }
                          }}
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
                          placeholder="Search..."
                          classNamePrefix="select"
                          value={{
                            label: selectedFaculty ?? "Search...",
                            value: selectedFaculty ?? "",
                          }}
                          defaultOptions={props.dataFaculty}
                          loadOptions={loadOptionsFaculty}
                          onChange={(e) => {
                            if (e) {
                              setSelectedFaculty(e.facultyName);
                              setFilterQuery({
                                ...filterQuery,
                                faculty: e.facultyName,
                              });
                            } else {
                              setFilterQuery({
                                ...filterQuery,
                                faculty: "",
                              });
                            }
                          }}
                        />
                        {errors.faculty && (
                          <div className="text-danger">{errors.faculty}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup className="custom-input-select" md="6">
                        <FormikDatePicker
                          label="Internship Start Date"
                          name="startDate"
                        />
                        {errors.startDate && (
                          <div className="text-danger">{errors.startDate}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup className="custom-input-select" md="6">
                        <FormikDatePicker
                          label="Internship End Date"
                          name="endDate"
                        />
                        {errors.endDate && (
                          <div className="text-danger">{errors.endDate}</div>
                        )}
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
                        setSelectedDepartment("Search...");
                        setSelectedSchool("Search...");
                        setSelectedFaculty("Search...");
                        setFilterQuery({
                          name: "",
                          mentorName: isMentor ? filterQuery.mentorName : "",
                          companyName: "",
                          dept: "",
                          schoolName: "",
                          faculty: "",
                          startDate: "",
                          endDate: "",
                        });
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      color="success"
                      id="submitBtn"
                      name="submitBtn"
                      // onClick={() => {
                      //   handleFilterQuery(filterQuery);
                      //   handleSubmit;
                      //   setSubmitting(true);
                      // }}
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
