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
  Table,
  Row,
  Col,
  Card,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import {
  Search,
  Save,
  Edit,
  Check,
  Plus,
  Trash,
  ArrowLeft,
  MoreVertical,
} from "react-feather";

import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
} from "components/notification";

import UserOptionItem from "components/UserOptionItem";

import AsyncSelect from "react-select/async";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import CustomRadio from "components/CustomInputs/CustomRadio";

import { wrapper } from "redux/store";
import { reauthenticate } from "redux/actions/auth";
import { connect, useDispatch } from "react-redux";
import { getAllRoles, getRolesByUPN } from "redux/actions/master/role";
import { searchRole, searchUser } from "helpers/master/masterRole";
import {
  getAllMasterUser,
  createMasterUser,
  getAllMasterUserInternal,
} from "redux/actions/master/userInternal";
import { getAllAllowance } from "redux/actions/master/allowance";
import EditAllowance from "components/ModalForm/EditAllowance";
import debounce from "lodash/debounce";

const CreateTableRow = ({ dispatch, data }) => {
  const { data: session, status } = useSession();

  const [editPopup, setEditPopup] = useState(false);
  const toggleEditPopup = () => setEditPopup(!editPopup);

  return (
    <tr>
      <td>
        <UncontrolledDropdown>
          <DropdownToggle
            className="icon-btn hide-arrow"
            id="optionsSelect"
            color="transparent"
            size="sm"
            caret
          >
            <MoreVertical size={15} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className="w-100"
              onClick={toggleEditPopup}
              id="editBtn"
            >
              <Edit className="mr-50" size={15} />
              <span className="align-middle">Edit</span>
              <EditAllowance
                visible={editPopup}
                toggle={toggleEditPopup}
                data={data}
              />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
      <td>{data.educationName}</td>
      <td>Rp {data.allowances[0].allowanceFee.toLocaleString("de-DE")}</td>
      <td>Rp {data.allowances[1].allowanceFee.toLocaleString("de-DE")}</td>
    </tr>
  );
};

const MasterAllowance = (props) => {
  const { dataMasterAllowance, sessionData, token } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: session, status } = useSession();

  const [isEditing, setEditing] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const toggleEditPopup = () => setEditPopup(!editPopup);

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, [dispatch]);

  const [active, setActive] = useState("1");
  const [values, setValues] = useState(null);
  const toggle = (key) => setActive(key);

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
      "Are you sure to add new user?",
      () => {
        actions.setSubmitting(true);
        dispatch(createMasterUser(bodyData)).then((res) => {
          if (res.status >= 200 && res.status <= 300) {
            actions.setSubmitting(false);
            successAlertNotification("Success", "Data saved succesfully");
            router.push("/master/user");
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
      // userPrincipalName: yup.string().required("User principal name is required"),
      // jabatan: yup.string().required("Job title is required"),
      // email: yup.string().required("Email is required"),
      // companyName: yup.string().required("Company name is required"),
    })
    .required();

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
      <BreadCrumbs breadCrumbParent="Master" breadCrumbActive="Allowance" />
      <div className="d-flex align-items-center my-3">
        <h2>Master Allowance</h2>
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
              <Table responsive className="border mt-1">
                <thead className="text-center">
                  <tr>
                    <th>Action</th>
                    <th>Education</th>
                    <th>WFH</th>
                    <th>WFO</th>
                  </tr>
                </thead>
                <tbody className="text-center text-break">
                  {dataMasterAllowance &&
                    dataMasterAllowance.data.map((data) => (
                      <CreateTableRow
                        key={data.id}
                        dispatch={dispatch}
                        data={data}
                      />
                    ))}
                </tbody>
              </Table>
              <ComboAlert
                routerPath="/master/allowance"
                {...{
                  isAlertModal,
                  setIsAlertModal,
                  alertStatus,
                  alertMessage,
                }}
              />
            </TabPane>
          </TabContent>
        </div>
      </Card>
    </div>
  );
};

MasterAllowance.getLayout = function getLayout(page) {
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

    await store.dispatch(getAllAllowance());

    const dataMasterAllowance = store.getState().masterAllowanceReducers;

    return {
      props: {
        token: sessionData.user.token,
        dataMasterAllowance,
        sessionData,
      },
    };
  }
);

export default MasterAllowance;
