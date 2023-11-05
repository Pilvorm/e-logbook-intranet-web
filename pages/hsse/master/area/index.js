import BreadCrumbs from "components/custom/BreadcrumbCustom";
import React, { useEffect, useState } from "react";
import { ExportIndicator, ListHeader, Pagination } from "components/shared";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import {
  Search,
  ChevronDown,
  Edit,
  ExternalLink,
  MoreVertical,
  Filter,
  Plus,
  Trash,
  XCircle,
  Trash2,
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
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { wrapper } from "redux/store";
import VerticalLayout from "src/@core/layouts/VerticalLayout";
import { Paper } from "@mui/material";
import ModalFilterArea from "components/online_form/ModalFilterArea";
import { connect, useDispatch } from "react-redux";
import { reauthenticate } from "redux/actions/auth";
import { deleteMasterArea, getAllMasterArea } from "redux/actions/master/area";
import {
  errorAlertNotification,
  successAlertNotification,
} from "components/notification";

const MasterArea = (props) => {
  const { token, dataMasterArea, query } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const pageSizeOptions = [5, 10, 25, 50];
  const [pageSize, setPageSize] = useState(query?.pageSize ?? 10);
  const [pageNumber, setPageNumber] = useState(query?.pageNumber ?? 1);
  const [searchQuery, setSearchQuery] = useState(query?.search ?? "");

  const [visibleFilter, setVisibleFilter] = useState(false);
  const toggleFilterPopup = () => setVisibleFilter(!visibleFilter);

  const [createPopup, setCreatePopup] = useState(false);
  const toggleCreatePopup = () => setCreatePopup(!createPopup);

  useEffect(() => {
    dispatch(reauthenticate(token));
  }, []);

  const handlePageSize = (value) => {
    setPageSize(value);

    router.push({
      pathname: router.pathname,
      query: {
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
        pageSize: pageSize,
        pageNumber: 1,
        search: searchQuery,
      },
    });
  };

  const deleteHandler = (id) => {
    dispatch(deleteMasterArea(id))
      .then(() => {
        successAlertNotification("Deleted", "Successfully Deleted Item");
        router.push({
          pathname: router.pathname,
        });
      })
      .catch((err) => {
        console.error(err);
        errorAlertNotification(
          "Error",
          "Something went wrong. Check console for details."
        );
      });
  };

  console.log(query);

  return (
    <div>
      <BreadCrumbs breadCrumbParent="Master" breadCrumbActive="Area" />
      <div className="my-2">
        <h2 className="m-0">Daftar Master Area</h2>
      </div>

      {/* <Card className="p-2">
        <ModalFilterArea visible={visibleFilter} toggle={toggleFilterPopup} />
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
      </Card> */}

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
          <div className="mr-2">
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
          <div className="d-flex align-items-center">
            <Button.Ripple
              color="primary"
              id="buttonCreate"
              name="buttonCreate"
              className="btn-next mr-1"
              onClick={() => router.push("/hsse/master/area/add")}
            >
              <Plus size={18} />
              <span className="align-middle ml-1 d-sm-inline-block d-none">
                Add New Area
              </span>
            </Button.Ripple>
          </div>
        </div>
      </div>
      <Table responsive className="border">
        <thead className="text-center">
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Company</th>
            <th>Area</th>
            <th>Status</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {dataMasterArea &&
          dataMasterArea.data &&
          dataMasterArea.data.length > 0 ? (
            dataMasterArea.data.map((item) => (
              <tr key={item.id}>
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
                        className="action-vuexy-item w-100"
                        onClick={() =>
                          router.push(`/hsse/master/area/${item.id}/edit`)
                        }
                        id="editBtn"
                      >
                        <Edit className="mr-2" size={15} />
                        <span className="align-middle font-weight-bold">
                          Edit
                        </span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </td>
                <td>{item.id}</td>
                <td>{item.site}</td>
                <td>{item.area}</td>
                <td>{item.status}</td>
                <td>{item.creator}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
      <Row className="mt-1 mb-3">
        <Col
          className="d-flex align-items-center justify-content-start"
          md="9"
          sm="12"
        >
          <p className="mb-0" style={{ color: "#b9b9c3" }}>
            Showing 1 to {pageSize} of {dataMasterArea.totalData} entries
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
            pageCount={dataMasterArea.totalPage || 1}
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

MasterArea.getLayout = function getLayout(page) {
  return <VerticalLayout>{page}</VerticalLayout>;
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const { query } = ctx;

    const sessionData = await getSession(ctx);

    if (!sessionData) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    }

    const token = sessionData.user.token;

    store.dispatch(reauthenticate(token));

    await store.dispatch(
      getAllMasterArea(
        query.pageNumber || 1,
        query.pageSize || 10,
        query.search || "",
        `createdByName=${sessionData.user.Name}|companyCode=${sessionData.user.CompCode}`
      )
    );

    const dataMasterArea = store.getState().masterAreaReducers;

    return {
      props: {
        token,
        dataMasterArea,
        query,
      },
    };
  }
);

export default connect((state) => state)(MasterArea);
