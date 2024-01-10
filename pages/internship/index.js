import { HTTP_CODE, SYSTEM_ADMIN, SUPER_USER } from "constant";
import Link from "next/link";
import BreadCrumbs from "components/custom/BreadcrumbCustom";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Filter, MoreVertical } from "react-feather";
import ReactPaginate from "react-paginate";
import {
  Button,
  Card,
  Col,
  CustomInput,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";
import { connect, useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import { wrapper } from "redux/store";

import {
  confirmAlertNotification,
  errorAlertNotification,
  successAlertNotification,
  deleteAlertNotification,
} from "components/notification";
import ModalFilterIntern from "components/modal/filter/ModalFilterIntern";
import VerticalLayout from "src/@core/layouts/VerticalLayout";

import { fetchUserRolesFunction } from "redux/actions/master/userInternal";
import { getAllMasterIntern } from "redux/actions/master/intern";
import { getAllMasterUserInternal } from "redux/actions/master/userInternal";

import { getSchoolAsyncSelect } from "redux/actions/master/school";
import { getFacultyAsyncSelect } from "redux/actions/master/faculty";
import { getDepartmentAsyncSelect } from "redux/actions/master/department";

import { getPermissionComponentByRoles } from "helpers/getPermission";

import moment from "moment";

const Internship = (props) => {
  const {
    dataMasterIntern,
    dataSchool,
    dataFaculty,
    dataDepartment,
    dataMentor,
    query,
    token,
    dataFilter,
    sessionData,
    userRoles,
  } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const isMentor = getPermissionComponentByRoles(["MENTOR"]);
  const isHR = getPermissionComponentByRoles(["HR"]);

  const pageSizeOptions = [5, 10, 15, 20];
  const [pageSize, setPageSize] = useState(query?.pageSize ?? 10);
  const [pageNumber, setPageNumber] = useState(query?.pageNumber ?? 1);
  const [searchQuery, setSearchQuery] = useState(query?.search ?? "");
  const [filterQuery, setFilterQuery] = useState(
    query?.filter
      ? { ...JSON.parse(query?.filter) }
      : {
          name: "",
          mentorName: isMentor ? sessionData.user.Name : "",
          companyName: "",
          dept: "",
          schoolName: "",
          faculty: "",
          joinDate: "",
          endDate: "",
        }
  );

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
        pageSize: value,
        pageNumber: 1,
        search: searchQuery,
        filter: JSON.stringify(filterQuery),
      },
    });
  };

  const handlePagination = (page) => {
    setPageNumber(page.selected + 1);

    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: page.selected + 1,
        search: searchQuery,
        filter: JSON.stringify(filterQuery),
      },
    });
  };

  const handleSearchQuery = () => {
    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: 1,
        search: searchQuery,
        filter: JSON.stringify(filterQuery),
      },
    });
  };

  const handleFilterQuery = (param) => {
    router.push({
      pathname: router.pathname,
      query: {
        pageSize: pageSize,
        pageNumber: 1,
        search: searchQuery,
        filter: JSON.stringify(param),
      },
    });
  };

  return (
    <div>
      <BreadCrumbs
        breadCrumbParent="Internship"
        breadCrumbActive="Intern List"
      />
      <div className="d-flex align-items-center my-3">
        <h2>Internship Logbook</h2>
      </div>

      <Card className="p-2">
        <ModalFilterIntern
          visible={visibleFilter}
          toggle={toggleFilterPopup}
          sessionData={sessionData}
          handleFilterQuery={handleFilterQuery}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
          dataSchool={dataSchool}
          dataFaculty={dataFaculty}
          dataDepartment={dataDepartment}
          dataMentor={dataMentor}
        />
        <div className="d-flex align-items-center">
          <Button.Ripple
            color="primary"
            id="buttonFilter"
            name="buttonFilter"
            className="btn-next mr-1"
            onClick={() => setVisibleFilter(true)}
          >
            <Filter size={18} />
            <span className="align-middle ml-1 d-sm-inline-block d-none">
              Filter
            </span>
          </Button.Ripple>
        </div>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center mr-2">
          <Label for="rows-per-page">Show</Label>
          <CustomInput
            className="form-control ml-50 pr-3"
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
          <div className="">
            <Input
              className="search-table2"
              type="text"
              name="search"
              placeholder="Search"
              value={searchQuery}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearchQuery();
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Table responsive className="border">
        <thead className="text-center">
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Department</th>
            <th>Company</th>
            <th>Mentor</th>
            <th>School/College</th>
            <th>Internship Period</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-center text-break">
          {dataMasterIntern &&
            dataMasterIntern.data.map((intern, index) => (
              <tr key={intern.id}>
                <td>{index + 1}.</td>
                <td className="text-uppercase">
                  <Link href={router.pathname + "/logbook/" + intern.id}>
                    <a style={{ color: "#3E11FF" }}>{intern.name}</a>
                  </Link>
                </td>
                <td>{intern.dept}</td>
                <td>{intern.companyName}</td>
                <td className="text-uppercase">{intern.mentorName}</td>
                <td>{intern.schoolName}</td>
                <td>
                  {moment(intern.joinDate).format("DD MMM YYYY")} -{" "}
                  {moment(intern.endDate).format("DD MMM YYYY")}
                </td>
                <td style={{ color: "#46A583" }}>Approved by Supervisor</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Row className="mt-1 mb-3">
        <Col
          className="d-flex align-items-center justify-content-start"
          md="9"
          sm="12"
        >
          <p className="mb-0" style={{ color: "#b9b9c3" }}>
            Showing 1 to {pageSize} of {dataMasterIntern.totalData} entries
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
            pageCount={dataMasterIntern.totalPage || 1}
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

// Internship.auth = {
//   roles: "INTERN",
// };

Internship.getLayout = function getLayout(page) {
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

    const token = sessionData.user.token;

    store.dispatch(reauthenticate(token));

    const userRoles = await store.dispatch(
      fetchUserRolesFunction(sessionData.user.UserPrincipalName)
    );
    let mentorFilter = userRoles?.some((role) => role.roleCode === "MENTOR")
      ? `mentorName=${sessionData.user.Name}`
      : "";

    const formatFilter = (filterData) => {
      const filteredFilter = Object.entries(filterData).filter(
        (data) => data[1] !== ""
      );
      const finalFilter = filteredFilter
        .map((data) => `${data[0]}=${data[1]}`)
        .join("|");

      return finalFilter;
    };

    await store.dispatch(
      getAllMasterIntern({
        "CSTM-COMPID": sessionData.user.CompCode,
        "CSTM-NAME": sessionData.user.Name,
        "CSTM-EMAIL": sessionData.user.Email,
        // "CSTM-ROLE": JSON.parse(sessionData.user.Roles)[0],
        "CSTM-UPN": sessionData.user.UserPrincipalName,
        "X-PAGINATION": true,
        "X-PAGE": query.pageNumber || 1,
        "X-PAGESIZE": query.pageSize || 10,
        "X-ORDERBY": "createdDate desc",
        "X-SEARCH": `*${query.search || ""}*`,
        "X-FILTER": `${
          query?.filter ? formatFilter(JSON.parse(query?.filter)) : mentorFilter
        }`,
      })
    );

    await store.dispatch(
      getAllMasterUserInternal({
        "X-PAGINATION": true,
        "X-PAGE": 1,
        "X-PAGESIZE": 10,
        "X-ORDERBY": "createdDate desc",
        "X-FILTER": `userRoles=mentor`,
      })
    );

    const dataMasterIntern = store.getState().masterInternReducers;

    const dataMentor = store.getState().masterUserInternalReducers;
    const dataSchool = await store.dispatch(getSchoolAsyncSelect());
    const dataFaculty = await store.dispatch(getFacultyAsyncSelect());
    const dataDepartment = await store.dispatch(getDepartmentAsyncSelect());

    return {
      props: {
        query,
        token,
        dataMasterIntern,
        dataSchool,
        dataFaculty,
        dataDepartment,
        dataMentor,
        dataFilter: query,
        sessionData,
        userRoles,
      },
    };
  }
);

export default connect((state) => state)(Internship);
