import { COMPANY_DATA } from "constant";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
import React, { useState, useCallback, useEffect } from "react";
import { ComboAlert } from "components/Alert";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import {
  Button,
  Spinner,
  Row,
  Col,
  Card,
  Container,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Search, Save, Check, ArrowLeft } from "react-feather";

import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
} from "components/notification";

import UserOptionItem from "components/UserOptionItem";

import AsyncSelect from "react-select/async";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";

import { wrapper } from "redux/store";
import { reauthenticate } from "redux/actions/auth";
import { connect, useDispatch } from "react-redux";
import { getAllRoles, getRolesByUPN } from "redux/actions/master/role";
import { searchRole, searchUser } from "helpers/master/masterRole";
import {
  getAllMasterUserInternal,
  deleteMasterUserInternal,
  getSbuAsyncSelect,
  searchMentor
} from "redux/actions/master/userInternal";
import {
  getMasterInternById,
  updateMasterIntern,
  approveMasterIntern,
} from "redux/actions/master/intern";
import { searchCompany, getAsyncOptionsSBU } from "helpers/sbu";
import FormikDatePicker from "components/CustomInputs/CustomDatePicker";
import debounce from "lodash/debounce";
import moment from "moment";

import { getAsyncOptionsSchool } from "helpers/master/masterSchool";
import { getAsyncOptionsFaculty } from "helpers/master/masterFaculty";
import { getAsyncOptionsDepartment } from "helpers/master/masterDepartment";

import { getSchoolAsyncSelect } from "redux/actions/master/school";
import { getFacultyAsyncSelect } from "redux/actions/master/faculty";
import { getDepartmentAsyncSelect } from "redux/actions/master/department";

const EditMasterIntern = (props) => {
  const {
    data,
    dataSchool,
    dataFaculty,
    dataDepartment,
    dataMentor,
    sessionData,
    token,
  } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, [dispatch]);

  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const toggle = (key) => setActive(key);
  
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState([]);
  const [userExist, setUserExist] = useState(false);

  const mentorList = dataMentor.data.map((mentor) => ({
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

  // Combo alert states
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  // onSubmit
  const onSubmit = (values, actions) => {
    const {
      companyCode,
      companyName,
      deptCode,
      dept,
      mentorUpn,
      mentorName,
      joinDate,
      endDate,
    } = values;

    let bodyData = {
      ...data,
      companyCode,
      companyName,
      deptCode,
      dept,
      mentorUpn,
      mentorName,
      joinDate,
      endDate,
    };

    confirmAlertNotification(
      "Update User",
      "Are you sure to update this user?",
      () => {
        actions.setSubmitting(true);
        dispatch(updateMasterIntern(data.id, bodyData)).then((res) => {
          if (res.status >= 200 && res.status <= 300) {
            actions.setSubmitting(false);
            successAlertNotification("Success", "Data updated successfully");
            router.push("/master/intern");
          } else {
            actions.setSubmitting(false);
            console.error(res);
            errorAlertNotification(
              "Error",
              res?.data?.message ? res?.data?.message : "Failed to save data"
            );
          }
        });
      },
      () => {
        actions.setSubmitting(false);
      }
    );
  };

  const validationSchema = yup
    .object({
      name: yup.string().required("Name is required"),
      joinDate: yup.date(), 
      endDate: yup
        .date()
        .min(yup.ref("joinDate"), "End date can't be before join date"),
    })
    .required();

  const onApproveHandler = async () => {
    const id = data.id;
    dispatch(approveMasterIntern(id))
      .then((res) => {
        console.log(res, "rsponsee");

        if (res.status >= 200 && res.status < 300) {
          successAlertNotification("Success", "User approved succesfully");
          router.push(`/master/intern/edit/${id}/`);
        } else {
          const { title, message } = formatAxiosErrorMessage(
            res,
            "Something went wrong, Please try again later."
          );
          errorAlertNotification(title, message);
        }
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
    // .finally(() => setIsActionBtnLoading(false));
  };

  // approval-related handler
  const notificationHandler = (state) => {
    if (state == "Approve") {
      confirmAlertNotification(
        "Confirmation",
        `Apakah Anda yakin untuk approve data ini?`,
        () => {
          onApproveHandler();
        },
        () => {}
      );
    }
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
    <div className="min-vh-100">
      <BreadCrumbs
        breadCrumbParent="Master"
        breadCrumbParent2="Intern"
        breadCrumbActive="Edit"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Edit Intern</h2>
      </div>

      <Card>
        <div className="px-2 py-2 mb-2">
          <Formik
            enableReinitialize
            initialValues={{
              name: data?.name ?? "",
              userPrincipalName: data?.userPrincipalName ?? "",
              schoolCode: data?.schoolCode ?? "",
              schoolName: data?.schoolName ?? "",
              facultyCode: data?.facultyCode ?? "",
              faculty: data?.faculty ?? "",
              companyCode: data?.companyCode ?? "",
              companyName: data?.companyName ?? "",
              deptCode: data?.deptCode ?? "",
              dept: data?.dept ?? "",
              mentorUpn: data?.mentorUpn ?? "",
              mentorName: data?.mentorName ?? "",
              joinDate: data?.joinDate ?? new Date(),
              endDate: data?.endDate ?? new Date(),
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleSubmit,
              handleChange,
              isSubmitting,
            }) => (
              <>
                {/* ACTIONS */}
                <div className="d-flex justify-content-between w-100 flex-wrap">
                  <div
                    className="d-flex flex-wrap"
                    style={{
                      gap: 20,
                      width: "70%",
                      paddingTop: "1rem",
                      paddingLeft: "2rem",
                    }}
                  >
                    <Button.Ripple
                      outline
                      type="submit"
                      color="danger"
                      className="btn-next"
                      onClick={() => router.back()}
                    >
                      <ArrowLeft size={18} />
                      <span className="ml-50 align-middle d-sm-inline-block d-none">
                        Back
                      </span>
                    </Button.Ripple>
                    <Button.Ripple
                      id="saveBtn"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner size="sm" color="white" />
                          <span className="ml-50">Submitting...</span>
                        </>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          <Save size={18} />
                          <div className="ml-1">Save</div>
                        </div>
                      )}
                    </Button.Ripple>
                    {data.status === "Unconfirmed" && (
                      <Button.Ripple
                        id="saveBtn"
                        color="primary"
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit, notificationHandler("Approve");
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner size="sm" color="white" />
                            <span className="ml-50">Approving...</span>
                          </>
                        ) : (
                          <div
                            className="d-flex"
                            style={{ alignItems: "center" }}
                          >
                            <Check size={18} />
                            <div className="ml-1">Approve</div>
                          </div>
                        )}
                      </Button.Ripple>
                    )}
                  </div>
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      marginTop: "1rem",
                      marginRight: "2rem",
                      fontSize: "1rem",
                    }}
                  >
                    <Button.Ripple
                      color={
                        data.status === "Confirmed" ? "primary" : "warning"
                      }
                      style={{ cursor: "text" }}
                    >
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <div>Status: {data.status}</div>
                      </div>
                    </Button.Ripple>
                  </div>
                </div>
                <Container>
                  <Row className="mt-3">
                    <Col md="6">
                      <FormGroup tag={Col} md="12">
                        <Label className="form-label font-weight-bold">
                          Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Name"
                          value={values.name}
                          onChange={handleChange("name")}
                          disabled
                        />
                        {errors.name && (
                          <div className="text-danger">{errors.name}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup tag={Col} md="12">
                        <Label className="form-label font-weight-bold">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="text"
                          placeholder="Email"
                          value={values.userPrincipalName}
                          onChange={handleChange("userPrincipalName")}
                          disabled
                        />
                        {errors.userPrincipalName && (
                          <div className="text-danger">
                            {errors.userPrincipalName}
                          </div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup tag={Col} md="12">
                        <Label className="form-label font-weight-bold">
                          School/College
                        </Label>
                        <Input
                          id="school"
                          type="text"
                          placeholder="School/College"
                          value={values.schoolName}
                          defaultOptions={dataSchool}
                          loadOptions={loadOptionsSchool}
                          onChange={handleChange("schoolName")}
                          disabled
                        />
                        {errors.schoolName && (
                          <div className="text-danger">{errors.schoolName}</div>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup tag={Col} md="12">
                        <Label className="form-label font-weight-bold">
                          Faculty
                        </Label>
                        <Input
                          id="faculty"
                          type="text"
                          placeholder="Faculty"
                          value={values.faculty}
                          defaultOptions={dataFaculty}
                          loadOptions={loadOptionsFaculty}
                          onChange={handleChange("faculty")}
                          disabled
                        />
                        {errors.faculty && (
                          <div className="text-danger">{errors.faculty}</div>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup tag={Col} md="12">
                        <Label className="form-label font-weight-bold">
                          Company
                        </Label>
                        <Input
                          id="companyCode"
                          name="companyCode"
                          classNamePrefix="select"
                          cacheOptions
                          value={values.companyName}
                          defaultOptions={COMPANY_DATA}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup tag={Col} md="12">
                        <Label className="form-label font-weight-bold">
                          Department
                        </Label>
                        <AsyncSelect
                          id="companyCode"
                          name="companyCode"
                          classNamePrefix="select"
                          cacheOptions
                          defaultOptions={dataDepartment}
                          loadOptions={loadOptionsDepartment}
                          value={{
                            label: values.dept,
                            value: values.deptCode,
                          }}
                          onChange={(e) => {
                            setSelectedDepartment(e);
                            setFieldValue("dept", e.departmentName);
                            setFieldValue("deptCode", e.departmentCode);
                          }}
                          placeholder="Search..."
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="6">
                      <FormGroup tag={Col} md="12">
                        <Label className="form-label font-weight-bold">
                          Mentor
                        </Label>
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
                          value={values.mentorName}
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
                            setFieldValue("mentorName", e.name);
                            setSelectedMentor(e);
                          }}
                          placeholder={
                            values.mentorName ||
                            selectedMentor?.name ||
                            "Search by name or email"
                          }
                          menuPlacement="top"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikDatePicker
                              label="Internship Join Date"
                              name="joinDate"
                              isBold
                            />
                            {errors.joinDate && (
                              <div className="text-danger">
                                {errors.joinDate}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <FormikDatePicker
                              label="Internship End Date"
                              name="endDate"
                              isBold
                            />
                            {errors.endDate && (
                              <div className="text-danger">
                                {errors.endDate}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </>
            )}
          </Formik>
          <ComboAlert
            routerPath="/master/intern"
            {...{
              isAlertModal,
              setIsAlertModal,
              alertStatus,
              alertMessage,
            }}
          />
        </div>
      </Card>
    </div>
  );
};

EditMasterIntern.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

//Render Data
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;
    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: `/auth?url=${ctx.resolvedUrl}`,
          permanent: false,
        },
      };
    }

    const token = sessionData.user.token;
    store.dispatch(reauthenticate(token));

    const response = await store.dispatch(getMasterInternById(query.id));

    if (response.status !== 200) {
      return {
        redirect: {
          destination: "/master/intern",
          permanent: false,
        },
      };
    }

    await store.dispatch(
      getAllMasterUserInternal({
        "X-PAGINATION": true,
        "X-PAGE": 1,
        "X-PAGESIZE": 10,
        "X-ORDERBY": "createdDate desc",
        "X-FILTER": `userRoles=mentor`,
      })
    );

    const dataMentor = store.getState().masterUserInternalReducers;
    const dataSchool = await store.dispatch(getSchoolAsyncSelect());
    const dataFaculty = await store.dispatch(getFacultyAsyncSelect());
    const dataDepartment = await store.dispatch(getDepartmentAsyncSelect());

    return {
      props: {
        token: sessionData.user.token,
        data: response.data,
        sessionData,
        dataSchool,
        dataFaculty,
        dataDepartment,
        dataMentor,
      },
    };
  }
);

export default connect((state) => state)(EditMasterIntern);
