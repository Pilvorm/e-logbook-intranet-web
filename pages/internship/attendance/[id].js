import { HTTP_CODE, SYSTEM_ADMIN, SUPER_USER } from "constant";

import BreadCrumbs from "components/custom/BreadcrumbCustom";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Filter,
  MoreVertical,
  Plus,
  Trash,
  Check,
  ExternalLink,
} from "react-feather";
import ReactPaginate from "react-paginate";
import {
  Button,
  Card,
  Col,
  CustomInput,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";

import { connect, useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import {
  getAllMasterUser,
  deleteMasterUser,
  getSbuAsyncSelect,
} from "redux/actions/master/user";
import { wrapper } from "redux/store";

import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
  deleteAlertNotification,
} from "components/notification";

import { getPermissionComponentByRoles } from "helpers/getPermission";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { InternDetailCard } from "components/Card/InternDetailCard";

const InternshipAttendance = (props) => {
  const { dataMasterUser, dataSBU, query, token, dataFilter, sessionData } =
    props;
  const dispatch = useDispatch();
  const router = useRouter();

  console.log(dataMasterUser);

  const pageSizeOptions = ["February 2023", "March", "April"];
  const [pageSize, setPageSize] = useState(query?.pageSize ?? 10);
  const [pageNumber, setPageNumber] = useState(query?.pageNumber ?? 1);
  const [searchQuery, setSearchQuery] = useState(query?.search ?? "");

  const [visibleFilter, setVisibleFilter] = useState(false);
  const toggleFilterPopup = () => setVisibleFilter(!visibleFilter);

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, [dispatch]);

  const handlePageSize = (value) => {
    setPageSize(value);

    router.push({
      pathname: router.pathname,
      query: {
        ...dataFilter,
        pageSize: value,
        pageNumber: 1,
        search: searchQuery,
      },
    });
  };

  const handlePagination = (page) => {
    setPageNumber(page.selected + 1);

    router.push({
      pathname: router.pathname,
      query: {
        ...dataFilter,
        pageSize: pageSize,
        pageNumber: page.selected + 1,
        search: searchQuery,
      },
    });
  };

  const handleSearchQuery = () => {
    router.push({
      pathname: router.pathname,
      query: {
        ...dataFilter,
        pageSize: pageSize,
        pageNumber: "",
        search: searchQuery,
      },
    });
  };

  const handleDelete = (e, data) => {
    e.preventDefault();
    confirmAlertNotification(
      "Delete Item",
      "Are you sure to delete this document?",
      () => {
        dispatch(deleteMasterUser(data.nik, data.userPrincipalName)).then(
          (res) => {
            console.log(res);
            if (res.status === HTTP_CODE.UNAUTHORIZED) {
              errorAlertNotification(
                "Error",
                "Something went wrong, Please try again later."
              );
            } else if (res.status === 200) {
              successAlertNotification(
                "Deleted Success",
                "Successfully Deleted Item"
              );
              router.push({
                pathname: router.pathname,
                query: { pageSize, pageNumber, searchQuery },
              });
            } else {
              errorAlertNotification(
                "Error",
                "Something went wrong, Please try again later."
              );
            }
          }
        );
      }
    );
  };

  return (
    <div>
      <BreadCrumbs
        breadCrumbParent="Internship"
        breadCrumbParent2="Attendance List"
        breadCrumbActive="Daniel Emerald"
      />
      <div className="d-flex align-items-center my-3">
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

        <h2 className={`ml-2 pl-2 border-left-dark`}>Intern Attendance List</h2>
      </div>

      <Card className="p-2 d-flex">
        <div className="flex-col align-items-center ">
          <div className="">
            <InternDetailCard
              nama="Daniel Emerald Sumarly"
              department="Corporate IT"
              school="Binus University"
              faculty="Computer Science"
              month="February"
              status="Complete"
              workingDays="14 WFH / 8 WFO"
              pay="Rp 1.920.000"
            />
          </div>
        </div>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
        <div className="d-flex align-items-center mr-2">
          <Label for="rows-per-page" className="font-weight-bold">
            Month
          </Label>
          <CustomInput
            className="form-control ml-1 pr-5"
            type="select"
            id="rows-per-page"
            value={pageSize}
            onChange={(e) => handlePageSize(e.target.value)}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </CustomInput>
        </div>

        <div className="d-flex align-items-center">
          <Button.Ripple
            id="saveBtn"
            color="warning"
            onClick={() => {
              onSaveHandler(transformAndValidation(formik.values));
            }}
          >
            <ExternalLink size={18} />
            <span className="align-middle ml-1 d-sm-inline-block d-none">
              Export to PDF
            </span>
          </Button.Ripple>
          <Button.Ripple
            id="saveBtn"
            className="ml-1"
            color="primary"
            onClick={() => {
              onSaveHandler(transformAndValidation(formik.values));
            }}
          >
            <Check size={18} />
            <span className="align-middle ml-1 d-sm-inline-block d-none">
              Sign All
            </span>
          </Button.Ripple>
        </div>
      </div>
      <Table responsive className="border">
        <thead className="text-center">
          <tr>
            <th>No.</th>
            <th>Date</th>
            <th>Activity</th>
            <th>WFH/WFO</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center text-break">
          <tr>
            <td>1</td>
            <td>21-02-23</td>
            <td className="text-left" style={{ width: "40%" }}>
              Lorem ipsum dolor sit amet. Est repellendus quia ut nostrum quasi
              est galisum deserunt ea dolores nemo eos totam recusandae. Sed
              nihil amet At voluptate quia et dolorem quisquam non temporibus
              atque ab magni sapiente est libero quasi. Quo atque sunt et
              placeat odio nam quas incidunt.
            </td>
            <td>WFH</td>
            <td style={{ color: "#46A583" }}>Signed by Supervisor</td>
            <td>Action</td>
          </tr>
          <tr>
            <td>2</td>
            <td>22-02-23</td>
            <td className="text-left" style={{ width: "40%" }}>
              Lorem ipsum dolor sit amet. Est repellendus quia ut nostrum quasi
              est galisum deserunt ea dolores nemo eos totam recusandae. Sed
              nihil amet At voluptate quia et dolorem quisquam non temporibus
              atque ab magni sapiente est libero quasi. Quo atque sunt et
              placeat odio nam quas incidunt.
            </td>
            <td>WFH</td>
            <td style={{ color: "#FF5B5C" }}>Waiting for Approval</td>
            <td>
              <Button.Ripple
                id="saveBtn"
                color="primary"
                onClick={() => {
                  onSaveHandler(transformAndValidation(formik.values));
                }}
              >
                <span className="align-middle d-sm-inline-block d-none">
                  Sign
                </span>
              </Button.Ripple>
            </td>
          </tr>
        </tbody>
      </Table>
      <Row className="mt-1 mb-3">
        <Col
          className="d-flex align-items-center justify-content-start"
          md="9"
          sm="12"
        >
          <p className="mb-0" style={{ color: "#b9b9c3" }}>
            Showing 1 to {pageSize} of {dataMasterUser.totalData} entries
          </p>
        </Col>
        <Col
          className="d-flex align-items-center justify-content-end"
          md="3"
          sm="12"
        >
          <ReactPaginate
            onPageChange={(page) => handlePagination(page)}
            forcePage={pageNumber - 1}
            pageCount={dataMasterUser.totalPage || 1}
            nextLabel={""}
            breakLabel={"..."}
            activeClassName={"active"}
            pageClassName={"page-item"}
            previousLabel={""}
            nextLinkClassName={"page-link"}
            nextClassName={"page-item next-item"}
            previousClassName={"page-item prev-item"}
            previousLinkClassName={"page-link"}
            pageLinkClassName={"page-link"}
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName={"pagination react-paginate m-0"}
          />
        </Col>
      </Row>
    </div>
  );
};

InternshipAttendance.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

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

    const dataSBU = await store.dispatch(getSbuAsyncSelect());

    const token = sessionData.user.token;

    let userRoles = [];

    try {
      userRoles = JSON.parse(sessionData.user.Roles);
    } catch (error) {
      console.error("Error parsing user roles JSON:", error);
    }

    const isSuperUser = userRoles.some((role) => role.RoleCode === SUPER_USER);
    const isSystemAdmin = userRoles.some(
      (role) => role.RoleCode === SYSTEM_ADMIN
    );

    let userCompCode = isSuperUser ? sessionData.user.CompCode : "";
    let userUPN =
      !isSuperUser && !isSystemAdmin ? sessionData.user.UserPrincipalName : "";

    store.dispatch(reauthenticate(token));

    await store.dispatch(
      getAllMasterUser(
        query.pageNumber || 1,
        query.pageSize || 10,
        query.search || "",
        query.name || "",
        query.username || "",
        userCompCode || query.companyCode,
        query.email || "",
        query.roleName || "",
        userUPN || query.creator
      )
    );

    const dataMasterUser = store.getState().masterUserReducers;

    return {
      props: {
        dataMasterUser,
        query,
        token,
        dataSBU,
        dataFilter: query,
        sessionData,
      },
    };
  }
);

export default connect((state) => state)(InternshipAttendance);
