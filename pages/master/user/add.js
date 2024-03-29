import { ROLE_DATA } from "constant";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
import React, { useState, useCallback, useEffect } from "react";
import { ComboAlert } from "components/Alert";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Spinner,
  Row,
  Col,
  Card,
  Container,
  FormGroup,
  Label,
  Input,
  CustomInput,
} from "reactstrap";
import { Search, Save, ArrowLeft } from "react-feather";

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
import {
  createMasterUserInternal,
  getAllMasterUserInternal,
} from "redux/actions/master/userInternal";
import { getAllRoles } from "redux/actions/master/role";

import debounce from "lodash/debounce";
import { promises as fs } from "fs";
import path from 'path';

const AddMasterUserInternal = (props) => {
  const { dataRoles, dataMasterUser, userProfile, sessionData, token } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, [dispatch]);

  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const toggle = (key) => setActive(key);

  // Handling user profile search
  const [selectedName, setSelectedName] = useState([]);
  const [userExist, setUserExist] = useState(false);

  const findUser = (name) => {
    const result = dataMasterUser.data.find(
      (user) => user.name.toUpperCase() == name
    );
    if (result) {
      setUserExist(true);
    } else {
      setUserExist(false);
    }
  };

  const searchUserAlt = (inputText) => {
    return userProfile.data.items.filter((user) => {
      return user.name.toLowerCase().includes(inputText.toLowerCase());
    });
  };

  const getAsyncOptionsName2 = (inputText) => {
    return searchUserAlt(inputText).map((singleData) => ({
      ...singleData,
      value: singleData.nik,
      label: singleData.name,
    }));
  };

  const loadOptionsName = (inputText) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(getAsyncOptionsName2(inputText));
      }, 1000);
    });

  // Handling role
  const [role, setRole] = useState([]);

  const addRole = (data) => {
    let tempRole = role;

    tempRole.push({
      roleCode: data.roleCode,
      roleName: data.roleName,
    });

    setRole(tempRole);
  };

  const removeRole = (data) => {
    let tempRole = role;

    tempRole.splice(
      tempRole.findIndex((dataRole) => dataRole.roleCode === data.roleCode),
      1
    );

    setRole(tempRole);
  };

  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    setCheckedItems({});
  }, [selectedName]);

  const handleCheckboxChange = (data) => (e) => {
    const { id, checked } = e.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [id]: checked,
    }));

    if (checked) {
      addRole(data);
    } else {
      removeRole(data);
    }
  };

  // Combo alert states
  const [isAlertModal, setIsAlertModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  // onSubmit
  const onSubmit = (values, actions) => {
    const {
      nik,
      userPrincipalName,
      name,
      email,
      jobTitle,
      deptName,
      compCode,
      compName,
    } = values;

    let bodyData = {
      userPrincipalName,
      nik,
      name,
      email,
      jobTitle,
      deptName,
      userRoles: role,
      compCode,
      compName,
      createdDate: new Date(),
      createdBy: sessionData?.user?.UserPrincipalName || "",
      updatedDate: new Date(),
      updatedBy: sessionData?.user?.UserPrincipalName || "",
    };

    if (bodyData.userRoles.length === 0) {
      return errorAlertNotification("Validation Error", `Please select a role`);
    }

    if (bodyData.userPrincipalName.length === 0) {
      return errorAlertNotification(
        "Validation Error",
        `Username for ${bodyData.name} is not found, please contact helpdesk for further information.`
      );
    }

    confirmAlertNotification(
      "Add New User",
      "Are you sure to add this user?",
      () => {
        actions.setSubmitting(true);
        dispatch(createMasterUserInternal(bodyData)).then((res) => {
          if (res.status >= 200 && res.status <= 300) {
            actions.setSubmitting(false);
            successAlertNotification("Success", "Data saved successfully");
            router.push("/master/user");
          } else {
            actions.setSubmitting(false);
            console.error(res);
            errorAlertNotification(
              "Error",
              res?.data?.message
                ? res?.data?.message
                : "Something went wrong, please try again later."
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
    })
    .required();

  const DropdownIndicator = (props) => {
    return (
      <Search
        set="light"
        // primaryColor="blueviolet"
        style={{ padding: "4px", marginRight: "2px" }}
      />
    );
  };

  return (
    <div className="min-vh-100">
      <BreadCrumbs
        breadCrumbParent="Master"
        breadCrumbParent2="User"
        breadCrumbActive="Add"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Add User</h2>
      </div>

      <Nav tabs>
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1");
            }}
            className={`${active === "1" ? "text-dark" : "text-muted"}`}
          >
            Data
          </NavLink>
        </NavItem>
      </Nav>

      <Card>
        <div className="px-2 py-2 mb-2">
          <TabContent className="ml-1 py-50" activeTab={active}>
            <TabPane tabId="1">
              <Formik
                enableReinitialize
                initialValues={{
                  userPrincipalName: selectedName?.userPrincipalName ?? "",
                  nik: selectedName?.nik ?? "",
                  name: selectedName?.name ?? "",
                  email: selectedName?.email ?? "",
                  jobTitle: selectedName?.jobTtlName ?? "",
                  deptName: selectedName?.divName ?? "",
                  compCode: selectedName?.compCode ?? "",
                  compName: selectedName?.compName ?? "",
                  userRoles: [],
                }}
                validationSchema={validationSchema}
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
                          disabled={isSubmitting || userExist}
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
                      </div>
                    </div>
                    <Container>
                      <Row className="mt-3">
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              Name
                            </Label>
                            <AsyncSelect
                              cacheOptions
                              id="nameSearch"
                              className="dropdownModal"
                              isSearchable
                              loadOptions={loadOptionsName}
                              components={{ DropdownIndicator }}
                              getOptionValue={(option) => option.value}
                              value={selectedName?.name}
                              formatOptionLabel={(data) => (
                                <UserOptionItem
                                  key={data?.id}
                                  profilePicture={
                                    data.profilePicturePath ||
                                    "/images/avatars/avatar-blank.png"
                                  }
                                  name={`${data?.name} (${data?.userPrincipalName})`}
                                  subtitle={data?.compName}
                                />
                              )}
                              onChange={(e) => {
                                setFieldValue("name", e.name);
                                setSelectedName(e);
                                findUser(e.name);
                                setRole([]);
                                // setFieldValue("userRoles", []);
                              }}
                              placeholder={
                                selectedName?.name || "Search by name or email"
                              }
                            />
                            {userExist && (
                              <div className="text-danger">
                                Data for this user already exists
                              </div>
                            )}
                            {errors.name && selectedName.length < 1 && (
                              <div className="text-danger">{errors.name}</div>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md="6"></Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              User Principal Name
                            </Label>
                            <Input
                              id="userUPN"
                              type="text"
                              placeholder="User Principal Name"
                              // value={selectedName?.userPrincipalName}
                              defaultValue={selectedName?.userPrincipalName}
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
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="text"
                              placeholder="Email"
                              defaultValue={selectedName?.email}
                              onChange={handleChange("email")}
                              disabled
                            />
                            {errors.email && (
                              <div className="text-danger">{errors.email}</div>
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
                              id="companyName"
                              type="text"
                              placeholder="Company Name"
                              defaultValue={selectedName?.compName}
                              onChange={handleChange("companyName")}
                              disabled
                            />
                            {errors.compName && (
                              <div className="text-danger">
                                {errors.compName}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup tag={Col} md="12">
                            <Label className="form-label font-weight-bold">
                              Jabatan
                            </Label>
                            <Input
                              id="jabatan"
                              type="text"
                              placeholder="Job Title Name"
                              defaultValue={selectedName?.jobTtlName}
                              onChange={handleChange("jabatan")}
                              disabled
                            />
                            {errors.jobTitle && (
                              <div className="text-danger">
                                {errors.jobTitle}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>

                      {/* ROLE */}
                      <Row className="mt-3">
                        <Col md="12">
                          <div
                            className="mx-1 d-flex flex-column gap-3"
                            style={{ gap: "16px" }}
                          >
                            <h5>Role</h5>
                            <div className="demo-inline-spacing">
                              {dataRoles?.data.map((data) => (
                                <CustomInput
                                  key={data?.roleCode}
                                  inline
                                  className="mb-1 mr-2"
                                  type="checkbox"
                                  id={data?.roleCode}
                                  name={data?.roleName}
                                  label={data?.roleName}
                                  onChange={handleCheckboxChange(data)}
                                  checked={
                                    checkedItems[data.roleCode] ||
                                    role.find(
                                      (dataRole) =>
                                        data.roleCode === dataRole.roleCode
                                    )
                                  }
                                  // disabled={
                                  //   currentRole === "HRD-Admin" &&
                                  //   data?.roleName !== "User-Interview"
                                  // }
                                />
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </>
                )}
              </Formik>
              {/* <ComboAlert
                routerPath="/master/user/add"
                {...{
                  isAlertModal,
                  setIsAlertModal,
                  alertStatus,
                  alertMessage,
                }}
              /> */}
            </TabPane>
          </TabContent>
        </div>
      </Card>
    </div>
  );
};

AddMasterUserInternal.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

AddMasterUserInternal.auth = {
  roles: ["HR"],
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

    await store.dispatch(getAllRoles());
    const dataRoles = store.getState().masterRoleReducers;

    await store.dispatch(
      getAllMasterUserInternal({
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": 1,
        "X-PAGESIZE": 50,
        "X-ORDERBY": "createdDate",
        "X-SEARCH": `*${""}*`,
      })
    );

    const dataMasterUser = store.getState().masterUserInternalReducers;

    var path = require('path');
    const file = await fs.readFile(
      path.join(process.cwd(), "public", "files", "dummyUserProfile.json"),
      "utf8"
    );
    const userProfile = JSON.parse(file);

    return {
      props: {
        token: sessionData.user.token,
        sessionData,
        dataRoles,
        dataMasterUser,
        userProfile,
      },
    };
  }
);

export default connect((state) => state)(AddMasterUserInternal);
