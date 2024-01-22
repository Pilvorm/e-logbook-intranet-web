import { HTTP_CODE, SYSTEM_ADMIN, SUPER_USER } from "constant";
import { useState } from "react";
import { useRouter } from "next/router";
import { Edit, Filter, MoreVertical, Trash } from "react-feather";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Table,
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

import moment from "moment";

const MyTaskMenu = (props) => {
  const { myTask } = props;
  const [active, setActive] = useState(1);

  console.log(myTask);

  const dataUnconfirmedIntern = myTask;

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
          
        </TabPane>
        <TabPane tabId={2}></TabPane>
      </TabContent>
    </div>
  );
};

export default MyTaskMenu;
