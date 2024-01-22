import { HTTP_CODE, SYSTEM_ADMIN, SUPER_USER } from "constant";
import { useState } from "react";
import { useRouter } from "next/router";
import { Edit, Check, MoreVertical, Trash } from "react-feather";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import { connect, useDispatch } from "react-redux";
import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
  deleteAlertNotification,
} from "components/notification";
import { CustomBadge } from "components/Badge/CustomBadge";
import { getPermissionComponentByRoles } from "helpers/getPermission";

import { deleteMasterIntern } from "redux/actions/master/intern";
import { approveLogbook } from "redux/actions/logbook";

import moment from "moment";

const MyTaskMenu = (props) => {
  const { sessionData, myTask } = props;
  const [active, setActive] = useState(1);

  console.log(myTask);

  const dataUnconfirmedIntern = myTask ?? {};
  const dataWaitingApproval = myTask ?? {};

  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = (e, data) => {
    e.preventDefault();
    confirmAlertNotification(
      "Delete Item",
      "Are you sure to delete this user?",
      () => {
        dispatch(deleteMasterIntern(data.id)).then((res) => {
          console.log(res);
          if (res.status === HTTP_CODE.UNAUTHORIZED) {
            errorAlertNotification(
              "Error",
              "Something went wrong, Please try again later."
            );
          } else if (res.status === 200 || res.status === 204) {
            successAlertNotification(
              "Deleted Success",
              "Successfully Deleted User"
            );
            router.push({
              pathname: router.pathname,
            });
          } else {
            errorAlertNotification(
              "Error",
              "Something went wrong, Please try again later."
            );
          }
        });
      }
    );
  };

  const onApproveHandler = async (id) => {
    let role = "";
    const upn = sessionData?.user?.UserPrincipalName;
    const name = sessionData?.user?.Name;
    const email = sessionData?.user?.Email;
    try {
      role = JSON.parse(localStorage.getItem("userRoles"))[0];
    } catch (e) {
      console.error(e);
      role = "";
    }

    dispatch(approveLogbook(role, upn, name, email, id))
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          successAlertNotification("Success", "Logbook approved succesfully");
          router.push({
            pathname: router.pathname,
          });
        } else {
          const { title, message } = formatAxiosErrorMessage(
            res,
            "Something went wrong, please try again later."
          );
          errorAlertNotification(title, message);
        }
        return res;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Nav tabs className="mt-2 mx-2">
        <NavItem>
          <NavLink
            active={active === 1}
            onClick={() => {
              setActive(1);
            }}
          >
            {getPermissionComponentByRoles(["HR"]) ? "Intern" : "Logbook"}
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink
            active={active === 2}
            onClick={() => {
              setActive(2);
            }}
          >
            Logbook
          </NavLink>
        </NavItem> */}
      </Nav>
      <TabContent className="py-50" activeTab={active}>
        <TabPane tabId={1}>
          {getPermissionComponentByRoles(["HR"]) && (
            <div className="shadow px-2 py-3">
              <h3 className="mb-3">Unconfirmed Intern</h3>
              <Table responsive className="border">
                <thead className="text-center">
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Company</th>
                    <th>Mentor</th>
                    <th>School/College</th>
                    <th>Faculty</th>
                    <th>Internship Period</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center text-break">
                  {dataUnconfirmedIntern &&
                    dataUnconfirmedIntern.map((intern) => (
                      <tr key={intern.id}>
                        <td className="text-uppercase">
                          <CustomBadge
                            type="danger"
                            content={`${intern.name}`}
                          />
                          {/* {intern.name} */}
                        </td>
                        <td>{intern.dept}</td>
                        <td>{intern.companyName}</td>
                        <td className="text-uppercase">{intern.mentorName}</td>
                        <td>{intern.schoolName}</td>
                        <td>{intern.faculty}</td>
                        <td>
                          {moment(intern.startDate).format("DD MMM YYYY")} -{" "}
                          {moment(intern.endDate).format("DD MMM YYYY")}
                        </td>
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
                                onClick={() =>
                                  router.push(
                                    `/master/intern/edit/${intern.id}/`
                                  )
                                }
                                id="editBtn"
                              >
                                <Edit className="mr-50" size={15} />
                                <span className="align-middle">Edit</span>
                              </DropdownItem>
                              <DropdownItem
                                className="w-100"
                                onClick={(e) => handleDelete(e, intern)}
                                id="deleteBtn"
                              >
                                <Trash className="mr-50" size={15} />
                                <span className="align-middle">Delete</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
          {getPermissionComponentByRoles(["MENTOR"]) && (
            <div className="shadow px-2 py-3">
              <h3 className="mb-3">Logbook Waiting for Approval</h3>
              <Table responsive className="border">
                <thead className="text-center">
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Department</th>
                    <th>Mentor</th>
                    <th>Logbook</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="text-center text-break">
                  {dataWaitingApproval &&
                    dataWaitingApproval.data.map((intern) => (
                      <tr key={intern.id}>
                        <td className="text-uppercase">
                          <CustomBadge type="warning" content={intern.name} />
                        </td>
                        <td>{intern.upn}</td>
                        <td>{intern.departmentName}</td>
                        <td className="text-uppercase">
                          {sessionData.user.Name}
                        </td>
                        <td>{`${intern.month} ${intern.year}`}</td>
                        <td>
                          <Button.Ripple
                            id="saveBtn"
                            className="ml-1"
                            color="primary"
                            onClick={() => {
                              confirmAlertNotification(
                                "Confirmation",
                                `Are you sure to approve this logbook?`,
                                () => onApproveHandler(intern.id),
                                () => {}
                              );
                            }}
                          >
                            <Check size={18} />
                            <span className="align-middle ml-1 d-sm-inline-block d-none">
                              Approve
                            </span>
                          </Button.Ripple>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
        </TabPane>
        <TabPane tabId={2}></TabPane>
      </TabContent>
    </div>
  );
};

export default MyTaskMenu;
